import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath, parse } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const smtpTransport = nodemailer.createTransport({
  host: "smtppro.zoho.eu",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (email, code, type) => {
  const templateData = {
    newUser: {
      path: "../email-template/new-user.html",
      subject: "borvey'e Hoş Geldiniz!",
    },
    passwordReset: {
      path: "../email-template/password-reset.html",
      subject: "Şifre Yenileme Bağlantısı",
    },
  };

  const templatePath = path.join(__dirname, templateData[type].path);
  let htmlContent = fs.readFileSync(templatePath, "utf8");

  htmlContent = htmlContent
    .replace("///CODE///", code)
    .replace("///email///", email);

  let sendResult = await smtpTransport.sendMail({
    from: `borvey <${process.env.EMAIL}>`,
    to: email,
    subject: templateData[type].subject,
    html: htmlContent,
  });

  return sendResult;
};

export const sendMailUpdate = async (email, route, type) => {
  const templateData = {
    newOffer: {
      path: "../email-template/update.html",
      subject: "Yeni bir teklifiniz var!",
      message: "Yeni bir teklifiniz var!",
    },
    newMessage: {
      path: "../email-template/update.html",
      subject: "Yeni bir mesajınız var!",
      message: "Yeni bir mesajınız var!",
    },
    offerStatus: {
      path: "../email-template/update.html",
      subject: "Teklifinize cevap geldi!",
      message: "Teklifinize cevap geldi!",
    },
  };

  const templatePath = path.join(__dirname, templateData[type].path);
  let htmlContent = fs.readFileSync(templatePath, "utf8");

  htmlContent = htmlContent
    .replace("&&&route&&&", route)
    .replace("&&&message&&&", templateData[type].message);

  let sendResult = await smtpTransport.sendMail({
    from: `borvey <${process.env.EMAIL}>`,
    to: email,
    subject: templateData[type].subject,
    html: htmlContent,
  });

  return sendResult;
};
