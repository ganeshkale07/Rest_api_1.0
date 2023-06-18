class CustomErrorHandler extends Error {
    constructor(statusCode, message){
        super();
        //Why these thing do not work 
        // statusCode,
        // message
        this.statusCode = statusCode,
        this.message = message
    }

    static userAlreadyExist(message){
        return new CustomErrorHandler(409,message);
    }

    static wrongCredentials(message = "email or password are incorrect"){
        return new CustomErrorHandler(401 , message);
        //401 authentication error
    }
}

export default CustomErrorHandler;