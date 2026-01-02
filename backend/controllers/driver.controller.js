const { firebase } = require('../config/firebase')

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
    const userRecord = await firebase.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Add additional information in Firebase Realtime Database
    const db = app.database();
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

exports.getDrivers = async () => {
  try {
    const db = firebase.database();
    const driversRef = db.ref('drivers'); // Reference to the drivers node
    const snapshot = await driversRef.orderByChild('lastName').once('value'); // Query by 'firstName'

    if (snapshot.exists()) {
      const drivers = snapshot.val(); // Get data
      return Object.keys(drivers).map(key => {
        return { $key: key, ...drivers[key] }; // Add key to each driver
      });
    } else {
      // res.status(404).send('No drivers found.');
    }
  } catch (error) {
    console.error('Error getting drivers:', error);
    // res.status(500).send('Failed to retrieve drivers');
  }
}
