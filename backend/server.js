const cors = require('cors');  // Import cors
const { initializeApp } = require("firebase/app");
const config = require("./config/firebase");
const authRoutes = require("./routes/auth.routes");
const carRoutes = require("./routes/car.routes");
const clientRoutes = require("./routes/client.routes");
const express = require("express");

const app = express();

app.use(cors());

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

app.get('/', (req, res) => res.send('Node.js Backend with Firebase!'));

app.use('/api', authRoutes);
app.use('/api/car', carRoutes);
app.use('/api/client', clientRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`));
