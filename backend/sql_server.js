const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Node.js Backend with MySQL!'));

// Register MySQL/SQL routes here
// app.use('/api/sql/...', require('./sql_routes/...'));

module.exports = app;
