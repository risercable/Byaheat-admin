const express = require('express');
const cors = require('cors');

const userController = require("./sql_controllers/user.controller");
const carController = require("./sql_controllers/car.controller");

const app = express();        // Create an instance of the express application

app.use(express.json());

app.use(cors());

// Define a route to retrieve data from the database
app.get('/user/getById', userController.getById);

app.post('/api/register', userController.registerDriver);

app.post('/api/car/create', carController.saveCar);
app.get('/api/car/getAll', carController.getAll);
app.post('/api/driver/login', userController.driverLogin);
module.exports = app;
