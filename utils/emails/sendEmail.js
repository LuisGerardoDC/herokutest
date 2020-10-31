const nodemailer = require('nodemailer');
const { config } = require('../../config');

async function sendMail(emailTo, subject, template){
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    service: config.emailService,
    host: config.emailHost,
    port: config.emailPort,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    }
  });

  const mailOptions = {
    from: `${config.emailName} <${config.emailUser}>`,
    to: emailTo || `${config.emailUser}`,
    subject: subject || "Bienvenido ✔",
    html: template || "<p>Hello world from Eventchain app</p>"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      console.log(error);
      throw 'No hemos podido enviar el correo';
    }else{
      console.log('Email enviado.');
    }
  })
}

module.exports = sendMail;