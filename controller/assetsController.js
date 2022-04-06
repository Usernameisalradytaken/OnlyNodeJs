const fs = require("fs/promises");
const path = require("path");

/// this will give css , image and also js
const assetsController = async (requestData) => {
  if (requestData.method != "GET")
    return {
      status: 400,
      payload: "Error",
      contentType: "text/html",
    };
    /// /assets/image/image1.jpg
    const assetFile = requestData.path.replace("/assets/", "").trim();
    /// images/image1.jpg
    if (typeof assetFile !== "string" && assetFile.length < 0)
    return {
      status: 400,
      payload: "Error",
      contentType: "text/html",
    };
    
    const assestPath = path.join(__dirname, "/../assets/");
    const fileRead = await fs.readFile(`${assestPath}${assetFile}`);
    if (!fileRead)
    return {
      status: 400,
      payload: "Error",
      contentType: "text/html",
    };
    
    const assetExtension = assetFile.split(".").pop();
    
    
  const contentTypeMap = {
    json: "application/json",
    map: "application/json",
    js: "text/javascript",
    plain: "text/plain",
    html: "text/html",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    favicon: "image/x-icon",
  };

  return {
    status: 200,
    payload: fileRead,
    contentType: contentTypeMap[assetExtension],
  };
};

module.exports = assetsController