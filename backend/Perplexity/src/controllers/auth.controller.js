import {userModel} from '../models/user.model.js'
import {sendEmail} from '../services/mail.service.js'
import jwt from 'jsonwebtoken'


const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

const registerController = async (req, res, next) => {
    const {username, email, password} = req.body
    const existingUser = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        return res.status(400).json({
            message: existingUser.email === email
                ? "User already exists with this email"
                : "User already exists with this username",
            success: false,
            err: "User Already Exists!"
        })
    }

    const user = await userModel.create({
        username, email, password
    })

    const emailVerificationToken = jwt.sign({
        email: user.email
    }, process.env.JWT_SECRET)

    await sendEmail(
        user.email,
        "Welcome To Perplexity! Please Verify Your Email",
        `
            <div style="max-width:480px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                <div style="background:linear-gradient(135deg,#84cc16,#10b981);padding:32px 24px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Perplexity</h1>
                </div>
                <div style="padding:32px 24px;text-align:center;">
                    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Verify your email</h2>
                    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Tap the button below to confirm your address.</p>
                    <a href="${frontendUrl}/api/auth/verify-email?token=${emailVerificationToken}"
                       style="display:inline-block;background:linear-gradient(135deg,#84cc16,#10b981);color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                        Verify Email
                    </a>
                </div>
                <div style="padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;color:#9ca3af;font-size:12px;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            </div>
        `
    )

    res.status(201).json({
        message: "User Registered Successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}


const verifyEmailController = async (req, res, next) => {
    const { token } = req.query

    if (!token) {
        return res.status(400).json({
            message: "Token is required",
            success: false
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findOne({ email: decoded.email })

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        })
    }

    if (user.verified) {
        const html = `
            <div style="max-width:480px;margin:50px auto;font-family:'Segoe UI',Arial,sans-serif;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="background:linear-gradient(135deg,#84cc16,#10b981);padding:32px 24px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Perplexity</h1>
                </div>
                <div style="padding:32px 24px;text-align:center;">
                    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Email Already Verified</h2>
                    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Your email has already been verified.</p>
                    <a href="${frontendUrl}/login"
                       style="display:inline-block;background:linear-gradient(135deg,#84cc16,#10b981);color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                        LOGIN
                    </a>
                </div>
                <div style="padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;color:#9ca3af;font-size:12px;">© Perplexity. All rights reserved.</p>
                </div>
            </div>
        `
        return res.send(html)
    }

    user.verified = true
    await user.save()

    const html = `
        <div style="max-width:480px;margin:50px auto;font-family:'Segoe UI',Arial,sans-serif;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#84cc16,#10b981);padding:32px 24px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Perplexity</h1>
            </div>
            <div style="padding:32px 24px;text-align:center;">
                <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Email Verified Successfully</h2>
                <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Your email is verified. You can now redirect to the login page.</p>
                <a href="${frontendUrl}/login"
                   style="display:inline-block;background:linear-gradient(135deg,#84cc16,#10b981);color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                    LOGIN
                </a>
            </div>
            <div style="padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">© Perplexity. All rights reserved.</p>
            </div>
        </div>
    `

    return res.send(html)
}

export { registerController, verifyEmailController }