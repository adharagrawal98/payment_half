import paypalService  from '../services/paypal';
import { getPaypalSecretsFromDB } from '../services/database';

exports.createOrder = async (req, res) => {
    const { amount, currency } = req.body;
    const userId = req.headers['user-id']

    const {clientId, clientSecret} = await getPaypalSecretsFromDB(userId);
    initPaypalService({clientId, clientSecret});

    console.log('Paypal service initialized with client id:', clientId);

    if (!amount || !currency) {
        return res.status(400).json({ error: 'Amount and currency are required.' });
    }

    try {
        const approvalUrl = await paypalService.createOrder(amount, currency);
        console.log(approvalUrl)
        res.status(200).json(approvalUrl);
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).json({ error: 'Failed to create PayPal order' });
    }
};

exports.capturePayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const userId = req.headers['user-id']

        const {clientId, clientSecret} = await getPaypalSecretsFromDB(userId);
        initPaypalService({clientId, clientSecret});
        
        console.log('Paypal service initialized with client id:', clientId);


        const paymentData = await paypalService.capturePayment(orderId)
        res.status(200).json(paymentData)
    } catch (error) {
        console.error('Error capturing payment:', error)
        res.status(500).json({ error: 'Failed to capture PayPal payment' })
    }
}

exports.authorizePayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const userId = req.headers['user-id']
        
        const {clientId, clientSecret} = await getPaypalSecretsFromDB(userId);
        initPaypalService({clientId, clientSecret});
        
        console.log('Paypal service initialized with client id:', clientId);


        const pamentData = await paypalService.authorizePayment(orderId)
        res.status(200).json(pamentData)
    } catch (error) {
        console.error('Error Authorize payment:', error)
        res.status(500).json({ error: 'Failed to authorize PayPal payment' })
    }
}
