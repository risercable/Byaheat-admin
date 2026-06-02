const { admin, firebase } = require('../config/firebase')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await firebase.auth().signInWithEmailAndPassword(email,password).then((userCredential) => {
      console.log(userCredential);
      // ...
      res.status(201).json({
        result: true,
        message: 'success'
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering driver',
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
    const driversRef = db.ref('drivers'); // Adjust your database structure
    await driversRef.child(userRecord.uid).set({
      firstName,
      lastName,
      email,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
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
