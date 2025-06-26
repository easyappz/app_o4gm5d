const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Mount API routes
app.use('/api', apiRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calculator-app';

// Connect to MongoDB using mongoose.connect instead of createConnection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
