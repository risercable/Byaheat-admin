const { admin } = require('../config/firebase')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Authenticate user with email and password
    await admin.auth().signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user; // Logged-in user data (basic info)
        const uid = user.uid; // Get the user's UID

        // Retrieve additional user data from Firebase Realtime Database
        const db = admin.database();
        const usersRef = db.ref('users'); // Adjust your database structure
        const snapshot = await usersRef.child(uid).once('value');

        if (!snapshot.exists()) {
          return res.status(404).json({
            message: 'Driver data not found in the database.',
          });
        }

        const driverData = snapshot.val(); // Additional driver info from DB

        res.status(200).json({
          message: 'Login successful',
          user: {
            uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
          },
          driverData, // Include additional data from DB
        });
      })
      .catch((error) => {
        console.error('Error during login:', error.message);

        return res.status(401).json({
          message: 'Invalid email or password',
          error: error.message,
        });
      });
  } catch (error) {
    console.error('Unexpected error:', error.message);

    res.status(500).json({
      message: 'An unexpected error occurred',
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { uid } = req.body; // UID should be sent from the frontend

    if (!uid) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Revoke all refresh tokens for the user (forces logout from all devices)
    await admin.auth().revokeRefreshTokens(uid);

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
}