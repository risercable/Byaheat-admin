const { admin } = require('../config/firebase');

const allowedRideTypes = ['single', 'family', 'barkada', 'premium'];

exports.create = async (req, res) => {
  try {
    const { uid, rideType, location, pickupAddress } = req.body;

    if (!uid) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!allowedRideTypes.includes(rideType)) {
      return res.status(400).json({ message: 'Invalid ride type.' });
    }

    const lookingForRef = admin.database().ref('lookingfor').child(uid);
    const payload = {
      uid,
      rideType,
      status: 'searching',
      location: location || null,
      pickupAddress: pickupAddress || null,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await lookingForRef.set(payload);

    return res.status(201).json({
      message: 'Ride search queued',
      requestId: uid
    });
  } catch (error) {
    console.error('Error queueing ride search:', error.message);

    return res.status(500).json({
      message: 'Error queueing ride search',
      error: error.message,
    });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    await admin.database().ref('lookingfor').child(uid).remove();

    return res.status(200).json({
      message: 'Ride search cancelled',
      requestId: uid,
    });
  } catch (error) {
    console.error('Error cancelling ride search:', error.message);

    return res.status(500).json({
      message: 'Error cancelling ride search',
      error: error.message,
    });
  }
  
};

exports.get = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const lookingForSnapshot = await admin.database().ref('lookingfor').child(uid).once('value');
    const lookingForData = lookingForSnapshot.val();

    if (!lookingForData) {
      return res.status(404).json({ message: 'Ride search not found.' });
    }

    return res.status(200).json({
      message: 'Ride search found',
      requestId: uid,
      ...lookingForData
    });
  } catch (error) {
    console.error('Error fetching ride search:', error.message);

    return res.status(500).json({
      message: 'Error fetching ride search',
      error: error.message,
    });
  }
}
