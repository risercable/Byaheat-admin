const { connection } = require('../config/global_sql')

exports.saveCar = async (req, res) => {
  try {
    const {
      carBrand,
      carCapacity,
      carType,
      carColor,
      carModel,
      carPlateNumber
    } = req.body;

    // Store hashed password in MySQL
    const sql = 'INSERT INTO car (carPlateNumber, carBrand, carModel, carType, carColor, carCapacity) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [carPlateNumber, carBrand, carModel, carType, carColor, carCapacity], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Car registered successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

exports.getAll = async (req, res) => {
  try {
    // Store hashed password in MySQL
    const sql = 'Select * from car';
    connection.query(sql, (err, results, fields) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
