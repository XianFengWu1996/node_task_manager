const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'shawnwu1996@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}`
    })
}

sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'shawnwu1996@gmail.com',
        subject: `Sorry to see you go, ${name}`,
        text: 'Please tell us what we could done better.'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}