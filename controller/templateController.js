const fs = require("fs/promises");
const path = require("path");

const templateController = async (requestData) => {
  if (requestData.method !== "GET")
    return {
      status: 400,
      payload: "Error",
      contentType: "text/html",
    };

  let templateName = requestData.path
    .split("/")
    .map((part) => {
      if (!part || !part.length) {
        return "";
      }
      return part[0].toUpperCase() + part.slice(1).toLocaleLowerCase();
    })
    .join("");
  // for this /
  if (!templateName | !templateName) templateName = "Index";

  if (templateName !== "string" && templateName.length < 0)
    return {
      status: 404,
      payload: "Error in loading template",
      contentType: "text/html",
    };

  const templatedir = path.join(__dirname, "/../templates/");
  const templateString = await fs.readFile(
    `${templatedir}${templateName}.html`,
    "utf-8"
  );
  const templateWrapperString = await fs.readFile(
    `${templatedir}TemplateWrapper.html`,
    "utf-8"
  );
  if (!templateWrapperString || !templateString)
    return {
      status: 404,
      payload: "Error in loading template",
      contentType: "text/html",
    };
  /// a wrapper will be on all the pages.
  const compiledTemplate = templateWrapperString.replace(
    "{{PageContent}}",
    templateString
  );

  if (!compiledTemplate)
    return {
      status: 404,
      payload: "Error in loading template",
      contentType: "text/html",
    };

  return {
    status: 404,
    payload: compiledTemplate,
    contentType: "text/html",
  };
};

module.exports = templateController;
