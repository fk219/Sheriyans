import { body, validationResult } from 'express-validator'

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }

    return res.status(400).json({
        errors: errors.array()
    })
}

const validateRegister = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 4, max: 30 }).withMessage('Username must be between 4 and 30 characters')
        .matches(/^(?!.*[<>"'`\\])[A-Za-z0-9_]+$/).withMessage('Username contains invalid characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    validate
]

export { validateRegister }