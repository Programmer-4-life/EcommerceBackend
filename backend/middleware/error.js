const ErrorHandler = require("../utils/errorhandler")

module.exports = (err , req, res , next) =>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal server error"

    //Wrong Mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message , 400)
    }

    //Mongoose duplicate key error i.e if user register with the same email adddress
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message , 400)
    }

    //Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, try again`
        err = new ErrorHandler(message , 400)
    }

    //JWT Expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired, try again`
        err = new ErrorHandler(message , 400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}