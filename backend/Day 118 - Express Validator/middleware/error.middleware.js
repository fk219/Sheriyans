import dotenv from 'dotenv'

dotenv.config()


const errorHandler = (err, req, res, next) => {

    const reponse = {
        messsage: err.message,
    }

    if(process.env.NODE_ENV==='development'){
        response.stack = err.stack
    }

    res.status(err.status).json(reponse)
}


export {errorHandler} 

