const express = require('express')
const router = express.Router()
const paypalController = require('../controllers/paypalController')

// Route to create an order
router.post('/create-order', paypalController.createOrder)

// Route to capture payment
router.post('/capture-payment/:orderId', paypalController.capturePayment)

module.exports = router
