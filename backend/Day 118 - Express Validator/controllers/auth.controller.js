const registerController = async (req, res, next) => {

    try{
        throw new Error('User Already exists bhadwe')
    }catch(err){
        err.status = 409
        next(err)
    }
}

export {registerController}