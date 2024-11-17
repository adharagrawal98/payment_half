const paypal = require('@paypal/checkout-server-sdk');

// Set up PayPal environment (Sandbox or Live)
const environment = new paypal.core.SandboxEnvironment(
    clientId = process.env.PAYPAL_CLIENT_ID || 'AS5b882r4vsM-Hfg0WnZ_8fuvsbDax_qTvUPCQF7X6Rcbuh8VkWN00PyWqfajo-QX0p-kXcJKexBMrlx',
    clientSecret = process.env.PAYPAL_SECRET || 'EHdyXjlfCnikEQTdKZz15WxcPPI6k7q_nuPaZLtIt0tFyob7TcGgeCAaCNFkVwnxITcaDmHYv9KQtf6B'
);

console.log("env", environment)
const client = new paypal.core.PayPalHttpClient(environment);

// Create an order
exports.createOrder = async (amount, currency = 'USD', referenceId = null) => {
    try {
        // Build the order request
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'AUTHORIZE',
            purchase_units: [
                {
                    reference_id: referenceId || 'default-reference-id', // Optional
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                },
            ],
            application_context: {
                user_action: 'PAY_NOW',
                return_url: 'http://localhost:3000/payment-success', // Replace with your return URL
                cancel_url: 'http://localhost:3000', // Replace with your cancel URL
            },
        });

        // Execute the order creation request
        const response = await client.execute(request);

        // Extract the approval link for redirecting the user
        const approvalLink = response.result.links.find(link => link.rel === 'approve');
        if (!approvalLink) {
            throw new Error('No approval link found in PayPal response');
        }

        return {
            orderId: response.result.id,
            approvalLink: approvalLink.href,
        };
    } catch (error) {
        console.error("Error creating PayPal order:", error.message);
        throw new Error("Failed to create PayPal order");
    }
};

// Capture payment (if needed)
exports.capturePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        // Execute the capture request
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        console.error("Error capturing PayPal payment:", error.message);
        throw new Error("Failed to capture PayPal payment");
    }
};

// Authorize payment (if needed)
exports.authorizePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersAuthorizeRequest(orderId);
        request.requestBody({});

        // Execute the authorization request
        const response = await client.execute(request);
        const authorization = response.result.purchase_units[0].payments.authorizations[0];
        return {
            authorizationId: authorization.id,
            status: authorization.status,
        };
    } catch (error) {
        console.error("Error authorizing PayPal payment:", error.message);
        throw new Error("Failed to authorize PayPal payment");
    }
};
