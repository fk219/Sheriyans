import {createTransport} from 'nodemailer'

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD
    }
})

transporter.verify()
.then(()=>{'Your Nodemailer ready to shoot Emails'})
.catch((err)=>{console.log(err)})

const sendEmail = async ({to, subject, html, text=""}) => {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    }

    const email = await transporter.sendMail(mailOptions)
    console.log(email)
    return "Email Sent Successfully to " + to
}

export {sendEmail}