/*сервіс для відправки email через SMTP за допомогою nodemailer.*/


import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// локальні змінні перезаписують production
dotenv.config({ path: '.env' }); // для production
dotenv.config({ path: '.env.local', override: true });// для локальної розробки


// Лог для перевірки, які змінні реально підхопились
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_FROM:', process.env.SMTP_FROM);


const smtpPort = Number(process.env.SMTP_PORT) || 587;

const smtpSecure = smtpPort === 465;  // true для SSL 465, false для TLS 587
console.log('Використовую порт:', smtpPort, 'Secure (SSL 465):', smtpSecure);//лог для перевірки

// Налаштування транспорту для відправки пошти
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port:  smtpPort,
  secure: smtpSecure, // true для 465, false для інших портів
  auth: {
    user: process.env.SMTP_USER, //емейл відправника
    pass: process.env.SMTP_PASSWORD, //пароль додатку
  },
  tls: { rejectUnauthorized: false }, // для Windows
});

// Функція для відправки листа
export const sendMail = async ({ from, to, subject, html }) => {
  console.log('Sending email to:', to, 'from:', from || process.env.SMTP_FROM);

  try {
    const info = await transporter.sendMail({
      from: from || process.env.SMTP_FROM,
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
