const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const paypalRoutes = require('./routes/paypalRoutes');

dotenv.config();

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: '*', // Allow requests from your React frontend
  credentials: true, // Allow cookies if needed
}));

// Middleware to parse JSON
app.use(express.json());

// PayPal routes
app.use('/api/paypal', paypalRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
