import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const template = `
  <h1>TLS Contact - Available Appointements</h1>
  <p> There is some available appointements</p>
`;
const recipents = ['achrafelkhamsi@gmail.com', 'ismailamsi@gmail.com'];
const mailOptions = {
  from: "TLS Contact Web Scrapper <scrapper@noreply.com>",
  to: recipents,
  subject: "TLS Contact Web Scrapper",
  html: template,
};

export const sendEmail = () => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}