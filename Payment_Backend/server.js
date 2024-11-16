const express = require('express')
const dotenv = require('dotenv')
const paypalRoutes = require('./routes/paypalRoutes')

dotenv.config()

const app = express()

// Middleware to parse JSON
app.use(express.json())

// PayPal routes
app.use('/api/paypal', paypalRoutes)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
