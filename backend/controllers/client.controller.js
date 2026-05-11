const { admin } = require('../config/firebase')

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//
//     await firebase.auth().signInWithEmailAndPassword(email,password).then((userCredential) => {
//       console.log(userCredential);
//       // ...
//       res.status(201).json({
//         result: true,
//         message: 'success'
//       });
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // ...
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error registering driver',
//       error: error.message,
//     });
//   }
// }

exports.registerBooking = async (req, res) => {
  try {
    const db = admin.database();
    const rentsRef = db.ref('rents');
    const newRentRef = await rentsRef.push({
      ...req.body,
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    // ✅ Send response back to client
    return res.status(201).json({
      message: 'Rent saved successfully',
      carId: newRentRef.key
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// exports.getDrivers = async () => {
//   try {
//     const db = firebase.database();
//     const driversRef = db.ref('drivers'); // Reference to the drivers node
//     const snapshot = await driversRef.orderByChild('lastName').once('value'); // Query by 'firstName'
//
//     if (snapshot.exists()) {
//       const drivers = snapshot.val(); // Get data
//       return Object.keys(drivers).map(key => {
//         return { $key: key, ...drivers[key] }; // Add key to each driver
//       });
//     } else {
//       // res.status(404).send('No drivers found.');
//     }
//   } catch (error) {
//     console.error('Error getting drivers:', error);
//     // res.status(500).send('Failed to retrieve drivers');
//   }
// }

exports.getAllClients = async (req, res) => {
  try {
    const db = admin.database();
    const snapshot = await db.ref("clients").once("value");
    const data = snapshot.val();

    if (!data) return res.status(200).json([]);

    // Convert Object of Objects to Array of Objects
    const carArray = Object.keys(data).map(key => ({
      id: key,       // Keep the Firebase ID if needed
      ...data[key]   // Spread the car details
    }));

    return res.status(200).json(carArray);
  } catch (error) {
    console.error("DEBUG ERROR:", error); // Look for 'auth/network-error' or 'timeout'
    res.status(500).json({ 
      message: "Server Timeout or Connectivity Error",
      details: error.message 
    });
  }
}
