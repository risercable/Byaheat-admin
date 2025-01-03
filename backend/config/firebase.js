const firebase = require('firebase/app'); // Import Firebase Client SDK
const admin = require('firebase-admin');
const serviceAccount = require('./byaheatbp-019a6780b9f6.json');
require('firebase/auth'); // Import Firebase Authentication
require('firebase/database'); // Import Firebase Realtime Database
require('dotenv').config();

// Firebase Client SDK Configuration (For client-like behavior)
const clientConfig = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

firebase.initializeApp(clientConfig);

// Export both SDKs
module.exports = {
  firebase, // For user-scoped actions or client-side simulation
};