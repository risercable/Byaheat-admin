require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = require('./xxxxxxxxxxxxxxxxxxxxx.json');

console.log("DB URL:", process.env.FIREBASE_DATABASE_URL);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

module.exports = { admin };