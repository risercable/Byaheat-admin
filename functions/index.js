// import {Reference as snapshot} from "firebase-admin";
var functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

exports.sendReceiptEmail = functions.database.ref('mysample/{sampleId}').onCreate((snapshot, context) => {

  const eventSnapshot = snapshot.after.val();

  const toemail = eventSnapshot.user_email;

  const exact_price = eventSnapshot.price;

  const destination = eventSnapshot.destination;

  const payment_method = eventSnapshot.payment_method;

  const msg = {
    to: toemail,
    from: 'lakbaymotors.phil@gmail.com',
    subject: 'Payment Received',
    text: 'thank you :)',
    html: '<strong>We hav</strong>',
  };
  sgMail.send(msg);
});

