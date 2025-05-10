const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// In CommonJS modules, we use __dirname and __filename directly
// No need to use fileURLToPath and import.meta.url
const _dirname = __dirname;
// const _filename = fileURLToPath(import.meta.url);
// const _dirname = path.dirname(_filename);

app.use(express.static(path.join(_dirname, '../frontend/build')));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/images', require('./routes/images'));
app.use('/api/comments', require('./routes/comments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

// Database connection and server start
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
}); 
