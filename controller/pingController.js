const pingController = async(request)=>{
    const responseContainer = { status : 200 , payload: "<h1>This is a ping request</h1>", contentType: "text/html" }
    return responseContainer;
}

module.exports = pingController