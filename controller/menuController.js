const database = require("../services/database")

const menuController = async (requestData) => {
    switch(requestData.method){
        case "GET":
            return await getMenu(requestData);
            /// TODO
        default:
            return "";
    }
}


const getMenu = async (requestData) => {
    const menu = await database.read('menus','main');
    if(!menu)
        return {
      status: 400,
      payload: "Missing required fields",
      contentType: "text/html",
    };

     return { status : 200 , payload : JSON.stringify(menu) , contentType : "html/text" }   
}

module.exports = menuController