/// create, read, delete, update, list everyone

const fs = require("fs").promises;
const path = require("path");

const database = {};

database.databasePath = path.join(__dirname, "../.data/");

/// first you have to read then u have to create the filename!
database.create = async (directory, filename, payload) => {
  const fileDiscriptor = await fs.open(
    `${database.databasePath}${directory}/${filename}.json`,
    "wx"
  );
  payload = JSON.stringify(payload);
  await fs.writeFile(fileDiscriptor, payload);
  await fileDiscriptor.close()
};

/// to the read the file

database.read = async (directory, filename) => {
  let data = "";
  try {
    data = await fs.readFile(
      `${database.databasePath}${directory}/${filename}.json`,
      "utf-8");
    data = JSON.parse(data);
  } catch (error) {
    data = null;
  }
  return data;
};

database.delete = async (directory, filename) => {
  let response = "";
  try {
    await fs.unlink(`${database.databasePath}${directory}/${filename}.json`);
    response = `The entry has been successfully deleted ${directory}/${filename}`;
  } catch (error) {
    if (err && err.code == "ENOENT") {
      response = "File doesn't exist, won't remove it.";
    } else {
      response = "Error occurred while trying to remove file";
    }
  }
  return response;
};

// if u want to update the file u first read it
database.update = async (directory, filename, payload) => {
  const fileDiscriptor = await fs.open(
    `${database.databasePath}${directory}/${filename}.json`,
    "r+"
  );
  // clearing the file instead of deleting
  await fs.truncate(`${database.databasePath}${directory}/${filename}.json`, 0);
  // now update the file
  payload = JSON.stringify(payload);
  await fs.writeFile(fileDiscriptor, payload);

  await fileDiscriptor.close();
};

// if u want to list users, orders

database.list = async (directory) => {
  const files = await fs.readdir(`${database.databasePath}${directory}`);
  let trimfiles = [];
  files.forEach((filename) => {
    trimfiles.push(filename.replace(`.json`, ""));
  });
  return trimfiles;
};

module.exports = database;
