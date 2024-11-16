const paypalService = require('../services/paypal')

exports.createOrder = async (req, res) => {
    try {
        const approvalUrl = await paypalService.createOrder()
        res.status(200).json({ approvalUrl })
    } catch (error) {
        console.error('Error creating order:', error)
        res.status(500).json({ error: 'Failed to create PayPal order' })
    }
}

exports.capturePayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const paymentData = await paypalService.capturePayment(orderId)
        res.status(200).json(paymentData)
    } catch (error) {
        console.error('Error capturing payment:', error)
        res.status(500).json({ error: 'Failed to capture PayPal payment' })
    }
}
