const { admin, firebase } = require('../config/firebase')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    // Additional info (role, etc.) lives under users/{uid}, same node admin.controller.js reads from
    const db = admin.database();
    const snapshot = await db.ref(`users/${uid}`).once('value');
    const driverData = snapshot.val();

    return res.status(200).json({
      message: 'Login successful',
      user: {
        uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      },
      driverData,
    });
  } catch (error) {
    const isAuthError = error.code && error.code.indexOf('auth/') === 0;

    return res.status(isAuthError ? 401 : 500).json({
      message: isAuthError ? 'Invalid email or password' : 'An unexpected error occurred',
      error: error.message,
    });
  }
}

exports.registerDriver = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a user in Firebase Authentication using Admin SDK
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Add additional information in Firebase Realtime Database
    const db = admin.database();

    const updates = {};
    const { uid } = userRecord;

    updates[`users/${uid}`] = {
      role: 'driver',
      email: email,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    updates[`drivers/${uid}`] = {
      firstName,
      lastName,
      email,
      createdAt: new Date().toISOString(),
      dispatched: false, // Default value for dispatched status
      verified: false, // Default value for verification status
      submittedRequirements: false, // Default value for requirements submission status
      // ...
    };

    // Single atomic call — both succeed or both fail, no partial state
    await admin.database().ref().update(updates);

    return res.status(201).json({
      message: 'Driver registered successfully',
      userId: userRecord.uid,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering driver',
      error: error.message,
    });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const db = admin.database();
    const snapshot = await db.ref("drivers").once("value");
    const data = snapshot.val();

    if (!data) return res.status(200).json([]);

    // Convert Object of Objects to Array of Objects
    const driverArray = Object.keys(data).map(key => ({
      id: key,       // Keep the Firebase ID if needed
      ...data[key]   // Spread the car details
    }));

    return res.status(200).json(driverArray);
  } catch (error) {
    console.error("DEBUG ERROR:", error); // Look for 'auth/network-error' or 'timeout'
    res.status(500).json({
      message: "Server Timeout or Connectivity Error",
      details: error.message
    });
  }
}

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const db = admin.database();
    const snapshot = await db.ref(`drivers/${id}`).once("value");
    const data = snapshot.val();

    if (!data) return res.status(200).json([]);

    // Convert Object of Objects to Array of Objects
    return res.status(200).json(data);
  } catch (error) {
    console.error("DEBUG ERROR:", error); // Look for 'auth/network-error' or 'timeout'
    res.status(500).json({
      message: "Server Timeout or Connectivity Error",
      details: error.message
    });
  }
}

exports.getUndispatchedDrivers = async (req, res) => {
  try {
    const db = admin.database();
    const snapshot = await db.ref("drivers").orderByChild('dispatched').equalTo(false).once("value");
    const data = snapshot.val();

    if (!data) return res.status(200).json([]);

    // Convert Object of Objects to Array of Objects
    const driverArray = Object.keys(data).map(key => ({
      id: key,       // Keep the Firebase ID if needed
      ...data[key]   // Spread the car details
    }));

    return res.status(200).json(driverArray);
  } catch (error) {
    console.error("DEBUG ERROR:", error); // Look for 'auth/network-error' or 'timeout'
    res.status(500).json({
      message: "Server Timeout or Connectivity Error",
      details: error.message
    });
  }
}

exports.getRole = async (req, res) => {
  try {
    const snapshot = await firebase.database().ref(`users/${uid}/role`).once('value');
    return  res.status(200).json(snapshot.val()); // returns the role string, or null if not found
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}
