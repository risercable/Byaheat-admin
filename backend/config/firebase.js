const firebase = require('firebase/app'); // Import Firebase Client SDK
require('firebase/auth'); // Import Firebase Authentication
require('firebase/database'); // Import Firebase Realtime Database

const admin = require('firebase-admin'); // Firebase Admin SDK
const serviceAccount = require('./xxxxxxxxxxxxxxxxxxxxx.json');
require('dotenv').config();

// 🔹 Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// 🔹 Firebase Client SDK Configuration (WITHOUT `credential`)
const clientConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// 🔹 Initialize Firebase Client SDK
if (!firebase.apps.length) {
  firebase.initializeApp(clientConfig);
}

// 🔹 Export Both SDKs
module.exports = {
  // firebase, // Client-side Firebase
  admin, // Admin SDK for server-side operations
};
