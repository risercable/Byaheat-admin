const express = require('express');
const cors = require('cors');

const userController = require("./sql_controllers/user.controller");
const carController = require("./sql_controllers/car.controller");

const app = express();        // Create an instance of the express application

app.use(express.json());

app.use(cors());

// Define a route to retrieve data from the database
app.get('/user/getAll', userController.getuser);

app.post('/api/register', userController.registerDriver);

app.post('/api/car/create', carController.saveCar);

module.exports = app;
