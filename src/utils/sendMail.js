/*сервіс для відправки email через SMTP за допомогою nodemailer.*/


import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Налаштування транспорту для відправки пошти
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // 465 порт працює тільки з SSL
  auth: {
    user: process.env.SMTP_USER, //емейл відправника
    pass: process.env.SMTP_PASSWORD, //пароль додатку
  },
  tls: { rejectUnauthorized: false }, // для Windows
});

// Функція для відправки листа
export const sendMail = async ({ from, to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to,//емейл отримувача
      subject,//тема листа
      html,//вміст листа у форматі HTML
    });
    return info;//інформація про відправлений лист
  } catch (err) {
    console.error('SMTP Error:', err); //лог помилки для Render
    throw err;
  }
};
