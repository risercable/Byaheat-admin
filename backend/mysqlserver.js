const express = require('express');
const cors = require('cors');

const userController = require("./sql_controllers/user.controller");

const app = express();        // Create an instance of the express application

app.use(cors());
  
// Define a route to retrieve data from the database
app.get('/user/getAll', userController.getuser);

app.post('/api/register', userController.registerDriver);
  
// Start the server on port 3000  
const port = 3000;  

app.listen(port, () => {
    console.log(`Server running on port ${port}`); 
});