const express = require("express");
const cors = require('cors');  // Import cors
const { initializeApp } = require("firebase/app");
const config = require("./config/firebase");
const authController = require("./controllers/driver.controller");

const app = express();

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

// Middleware, routes, etc.
app.get("/", (req, res) => {
  res.send("Node.js Backend with Firebase!");
});

// API route for user registration
app.post('/api/drivernew', authController.registerDriver);

// API route for user login
app.post('/api/driverlogin', authController.login);

app.get('/api/getAllDrivers', async (req, res) => {
  try {
    const driversData = await authController.getDrivers();
    res.json(driversData); // Return the parsed JSON data
  } catch (error) {
    res.status(500).send('Error fetching drivers');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
