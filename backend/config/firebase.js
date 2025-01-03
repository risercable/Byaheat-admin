const admin = require('firebase-admin');
const serviceAccount = require('./byaheatbp-019a6780b9f6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://byaheatbp-default-rtdb.firebaseio.com", // Your Firebase Realtime Database URL
});

const database = admin.database();

module.exports = { admin, database };
