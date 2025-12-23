const { connection } = require('../config/global_sql')

exports.getuser = async (req, res) => {
    connection.query('SELECT * FROM user', (err, results) => {
  
        if (err) throw err;
    
        res.json(results);        // Send query results back to the client
    });
}

exports.registerDriver = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Store hashed password in MySQL
        const sql = 'INSERT INTO users (email, password, salt, isDriver) VALUES (?, ?, ?, ?)';
        connection.query(sql, [email, hashedPassword, salt, 1], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}