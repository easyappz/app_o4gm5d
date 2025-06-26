const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Schema for storing calculation history
const CalculationSchema = new mongoose.Schema({
  operation: { type: String, required: true },
  firstValue: { type: Number, required: true },
  secondValue: { type: Number, required: true },
  result: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Define the model directly using mongoose
const Calculation = mongoose.model('Calculation', CalculationSchema);

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { firstValue, secondValue, operation } = req.body;

    if (!firstValue || !secondValue || !operation) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (isNaN(firstValue) || isNaN(secondValue)) {
      return res.status(400).json({ error: 'Invalid number values' });
    }

    let result;
    if (operation === '+') {
      result = firstValue + secondValue;
    } else if (operation === '-') {
      result = firstValue - secondValue;
    } else if (operation === '*') {
      result = firstValue * secondValue;
    } else if (operation === '/') {
      if (secondValue === 0) {
        return res.status(400).json({ error: 'Division by zero is not allowed' });
      }
      result = firstValue / secondValue;
    } else {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    // Save calculation to history
    const calculation = new Calculation({
      operation,
      firstValue,
      secondValue,
      result
    });
    await calculation.save();

    res.json({ result });
  } catch (error) {
    console.error('Error in calculate endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/history
router.get('/history', async (req, res) => {
  try {
    const history = await Calculation.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    console.error('Error fetching calculation history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
