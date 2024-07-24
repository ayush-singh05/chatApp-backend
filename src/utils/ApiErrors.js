// custom api errors 
export class ApiError extends Error {
    constructor(
        statusCode,
        message="Something wents wrong",
        errors=[],
        stack=""
    ){
        super(message),
        this.statusCode = statusCode;
        this.message = message;
        this.succcess = false;
        this.errors = errors;
        
        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}