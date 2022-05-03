const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: "bechir.ettaieb@akrussit.com",
            pass: "akrussit@2022"
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
};