const registerController = async (req, res, next) => {

    try{
        res.status(201).json({
            message: "Request Reached till Controller"
        })
    }catch(err){
        err.status = 409
        next(err)
    }
}

export {registerController}