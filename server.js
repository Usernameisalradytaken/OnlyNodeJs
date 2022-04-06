const http = require("http");
const url = require("url");
const router = require("./router");
const port = 9000;

const server = http.createServer((request, response) => {
  const parseURL = url.parse(request.url, true);

  let payload = "";

  request.on("data", (chunk) => {
    payload += chunk;
  });

  request.on("end", () => {
    payload = payload.toString();

    const path = parseURL.pathname.toLocaleLowerCase();
    let controller;
    console.log(path);
    if (router.routes[path]) {
      controller = router.routes[path];
    } else if (router.routes["/" + path.split("/")[1] + "/*"]) {
      controller = router.routes["/" + path.split("/")[1] + "/*"];
    } else {
      controller = router.notFound;
    }
    let requestData = {
      method: request.method,
      payload: payload,
      query: parseURL.query,
      path: parseURL.pathname,
      headers: request.headers,
    };
    
    // console.log("========iamhere=========");
    controller(requestData).then((responseContainer) => {
      // console.log("========iamhere=========");
      console.log(responseContainer);
      response.setHeader("Content-Type", responseContainer.contentType);
      response.writeHead(responseContainer.status);

      response.end(responseContainer.payload);
    });
  });
});

server.listen(port, () => {
  console.log("server is listening on", port);
});
