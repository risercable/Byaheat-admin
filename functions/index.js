var functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
sgMail.setSubstitutionWrappers('{{', '}}');

exports.sendReceiptEmail = functions.database.ref(`payments/{rideID}/`).onCreate((snap, context) => {

  const eventSnapshot = snap.child('paid').val();
  let time = eventSnapshot.timestamp;
  const d = new Date(0);
  d.setUTCSeconds(time);
  const toemail = eventSnapshot.client_email;
  // let fname = eventSnapshot.customer_first_name;
  let eprice = eventSnapshot.price;
  let ctype = eventSnapshot.ride_type;
  let dname = eventSnapshot.driver_name;
  let cname = eventSnapshot.customer_name;
  let pup = eventSnapshot.pickup;
  let doff = eventSnapshot.destination;
  let pmethod = eventSnapshot.payment_method;
  const msg = {
    to: toemail,
    from: 'lakbaymotors.phil@gmail.com',
    subject: 'Payment Received',
    templateId: "d-45ee3f9bd59548259744f001a9cd514c",
		dynamicTemplateData: {
      firstname: cname,
      exact_price: eprice,
      timestamp: d,
      car_type: ctype,
      driver_name: dname,
      client_name: cname,
      pickup: pup,
      dropoff: doff,
      payment_method: pmethod
		}
  };
  sgMail.send(msg).then(() => {
    console.log("eto success");
  }).catch((error) => {
    console.log("eto error: ", error);
  });
});

