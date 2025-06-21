const parser = require('lambda-multipart-parser');
const sgMail = require('@sendgrid/mail');

// Imposta la chiave API di SendGrid presa dalle variabili d'ambiente di Netlify
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const result = await parser.parse(event);
    
    const name = result['Nome Cliente'];
    const issue = result['Descrizione Problema'];
    const phone = result['Numero Telefono'];
    const file = result.files[0];

    const attachments = [];
    if (file) {
      attachments.push({
        filename: file.filename,
        content: file.content.toString('base64'), // SendGrid vuole il file in formato Base64
        type: file.contentType,
        disposition: 'attachment',
      });
    }

    const msg = {
      to: 'easytravel7781@gmail.com', // L'email dove vuoi ricevere le notifiche
      from: {
        name: 'Sito Edilkappa',
        // !!! SOSTITUISCI CON LA TUA EMAIL VERIFICATA SU SENDGRID !!!
        email: 'christianstano450@gmail.com' 
      },
      subject: `Nuova richiesta di assistenza da ${name}`,
      html: `
        <h1>Nuova Richiesta di Assistenza</h1>
        <p><strong>Nome Cliente:</strong> ${name}</p>
        <p><strong>Numero Telefono:</strong> ${phone}</p>
        <hr>
        <p><strong>Descrizione Problema:</strong></p>
        <p>${issue}</p>
      `,
      attachments: attachments,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Invio riuscito!' }),
    };

  } catch (error) {
    console.error('Errore di SendGrid:', error.response ? error.response.body : error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore durante l\'invio dell\'email.' }),
    };
  }
};
