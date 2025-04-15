import nodemailer from 'nodemailer';


export const enviarEmailRecuperacion = async ({nombre, email, token}) => {

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


    const resetUrl = `${process.env.FRONTEND_URL}/restablecer-password/${token}`;


    const opcionesEmail = {
      from: 'Soporte ASTOR <no-reply@astor.com>',
      to: email,
      subject: 'Restablece tu contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #FFD166;">Hola ${nombre},</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" target="_blank" style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #FFD166;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              font-size: 16px;
            ">
              Restablecer Contraseña
            </a>
          </p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <hr style="margin: 40px 0;" />
          <p style="font-size: 14px; color: #888;">Gracias,<br/>El equipo de ASTOR</p>
        </div>
      `,
    };
    
      const info = await transport.sendMail(opcionesEmail);
      console.log("Email enviado: ", info.messageId);

};