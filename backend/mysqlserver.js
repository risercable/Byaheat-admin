const express = require('express');
const cors = require('cors');

const fileController = require("./sql_controllers/file.controller");

const app = express();        // Create an instance of the express application

app.use(express.json());

app.use(cors());

// Define a route to retrieve data from the database
app.get('/upload/user', fileController.uploadFile);
module.exports = app;
