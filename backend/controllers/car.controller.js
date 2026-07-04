const { admin, firebase} = require('../config/firebase')

exports.saveCar = async (req, res) => {
  try {
    const db = admin.database();
    const carsRef = db.ref('all_cars');
    const newCarRef = await carsRef.push({
      ...req.body,
      timestamp: admin.database.ServerValue.TIMESTAMP
    });

    // ✅ Send response back to client
    return res.status(201).json({
      message: 'Car saved successfully',
      carId: newCarRef.key
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const snapshot = await admin.database().ref("all_cars").once("value");
    const data = snapshot.val();

    if (!data) return res.status(200).json([]);

    // Convert Object of Objects to Array of Objects
    const carArray = Object.keys(data).map(key => ({
      id: key,       // Keep the Firebase ID if needed
      ...data[key]   // Spread the car details
    }));

    return res.status(200).json(carArray);
  } catch (error) {
    res.status(500).send(error);
  }
}
