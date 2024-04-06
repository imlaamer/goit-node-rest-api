import nodemailer from "nodemailer";
import "dotenv/config"; //

const { UKR_NET_FROM, UKR_NET_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
});

export const sendVerificationEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transporter.sendMail(email);
};
