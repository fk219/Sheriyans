import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify()
.then(() => {console.log("Email transporter is ready to send emails")})
.catch((error) => {console.error("Error occurred while verifying email transporter:", error)})


const sendEmail = async (to, subject, html, text) => {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    }

    const details = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully:", details)
}

export {sendEmail}