
/*

    notify.js

    - based on the old mailer.js, this is a templatized way of sending transactional emails
    - use notify-templates.js to build templates
    - SMTP_USER and SMTP_PASS are both created in Mailgun as SMTP users
      - do NOT use the Mailgun API Key for this; always stick to SMTP users
    
    usage: 
      await notify({
        subject: 'yowwwwza',
        html: template,
        text: template,
        fromName: 'I AM A BANANA!!!',
        to: 'janeazy@gmail.com'
      })


    last updated: 7/30/2020

*/


import nodemailer from 'nodemailer'
import { config } from "dotenv";

config() // https://github.com/sveltejs/sapper/issues/122
// import uuid from 'uuid-by-string';

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // app.get('smtp').user,
    pass: process.env.SMTP_PASS, // app.get('smtp').pass
  }
});


let preset = {
  fromName: 'Phage Directory',
  fromEmail: process.env.SMTP_USER,
  replyTo: 'Phage directory',
  replyEmail: 'hello@phage.directory',
  to: 'auto@phage.directory', // comma separated emails
  subject: 'Email subject',
  // html: '<p>Hello World!</p>', // html should be optional
  text: 'Hello World!'
}


export const notifySetup = (data) => {
  preset['fromName'] = data['fromName']
  preset['fromEmail'] = data['fromEmail']
  preset['replyTo'] = data['replyTo']
  preset['replyEmail'] = data['replyEmail']
  preset['to'] = data['to']
  preset['subject'] = data['subject']
  preset['html'] = data['html']
  preset['text'] = data['text']
}

export const notify = (data) => {
  try {
    const fromName = data['fromName'] || preset['fromName']
    const fromEmail = data['fromEmail'] || preset['fromEmail']
    const replyTo = data['replyTo'] || preset['replyTo']
    const replyEmail = data['replyEmail'] || preset['replyEmail']
    const to = data['to'] || preset['to']
    const subject = data['subject'] || preset['subject']
    const html = data['html'] || preset['html']
    const text = data['text'] || preset['text']

    const mailData = {
      from: `${fromName} <${fromEmail}>`,
      'reply-to': `"${replyTo}" <${replyEmail}>`,
      to: [`${to}`],
      subject: subject,
      html: html,
      text: text,
    }

    return new Promise((resolve) => {
      transporter.sendMail(mailData, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response, mailData);
          resolve(info.response)
        }
      });
    })

  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}





