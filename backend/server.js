const express = require("express");
const cors = require('cors');  // Import cors
const { initializeApp } = require("firebase/app");
const config = require("./config/firebase");
const authController = require("./controllers/driver.controller");
const adminController = require("./controllers/admin.controller");
const carController = require("./controllers/car.controller");
const clientController = require("./controllers/client.controller");

const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4300'],
}));

app.use(express.json());

app.use((req, res, next) => {
  // Mock user data from a database or auth middleware
  const user = {
    isAdmin: true,
    firstName: 'John',
    lastName: 'Doe',
  };

  res.locals.user = user; // Save user data in res.locals
  next();
});

// Middleware, routes, etc.
app.get("/", (req, res) => {
  res.send("Node.js Backend with Firebase!");
});

app.post('/api/login', adminController.login);
app.post('/api/book', clientController.registerBooking);

app.post('/api/logout', adminController.logout);

// API route for user registration
app.post('/api/drivernew', authController.registerDriver);

app.post('/api/car/create', carController.saveCar);

app.get('/api/car/getAll', carController.getAll);

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

app.get('/api/client/all', clientController.getAllClients)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
