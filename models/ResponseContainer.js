class ResponseContainer {
    constructor(statuscode, payload, contentType){
        this.statuscode = statuscode;
        if(this.statuscode == 400)
           
        this.payload = payload;
        this.contentType = contentType;
    }
}