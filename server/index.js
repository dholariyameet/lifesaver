const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',      require('./routes/authroutes'));
app.use('/api/donors',    require('./routes/donorroutes'));
app.use('/api/inventory', require('./routes/inventoryroutes'));
app.use('/api/requests',  require('./routes/requestroutes'));
app.use('/api/admin',     require('./routes/adminroutes'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: '🩸 Life Saver API is running!' });
});

// Connect MongoDB & start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
  })
  .catch((err) => console.log(err));