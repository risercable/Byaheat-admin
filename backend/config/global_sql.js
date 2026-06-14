const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',       // Replace with your MySQL username
    password: '',   // Replace with your MySQL password
    database: 'lakbay'    // Replace with your database name
}); 
  
// Establish a connection to the database
connection.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        return;
    }
    console.log('Connected to the MySQL server.');
});

module.exports = {
    connection
};