const mysql = require('mysql2/promise');

exports.getById = async (req, res) => {
  const connection = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lakbay'
  });

  const { id } = req.body;

  const [rows] = await connection.query('SELECT * FROM user where id = ? ', [id]);

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = rows[0];

  return res.json({
    message: 'Login successful',
    user
  });
};

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

exports.driverLogin = async (req, res) => {
  try {
    const connection = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'lakbay'
    });

    const { email, password } = req.body;

    console.log('LOGIN:', email, password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const [rows] = await connection.query(
      'SELECT id FROM driver WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    return res.json({
      message: 'Login successful',
      userId: user.id
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
