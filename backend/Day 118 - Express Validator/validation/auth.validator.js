import {body, validationResult} from 'express-validator'

const validator = (req, res, next) => {
    const errors = validationResults(req)

    if(errors.isEmpty()){
        return next()
    }

    res.status(400).json({
        errors: errors.array()
    })
}

const registerValidation = [
    body("email").isEmail().withMessage("Please enter Correct Email Format"),
    body("username").isString().withMessage("Username Should be String"),
    body("password").isLength({min: 6, max: 12}).withMessage("Password should be atleast 6 and Maximum 12 Character Long"),
    validator()
]

// .isMongo   To Check Mongo ID
// .custom     To Create own Rule

export {registerValidation}