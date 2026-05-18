const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
const admin = require('firebase-admin');
const serviceAccount = require('./xxxxxxxxxxxxxxxxxxxxx.json');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

module.exports = { admin, firebase };
