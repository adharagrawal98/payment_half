const paypal = require('@paypal/checkout-server-sdk');


exports.initPaypalService = async ({clientId, clientSecret}) => {
    const environment = new paypal.core.SandboxEnvironment(
        clientId,
        clientSecret
    );

    return new paypal.core.PayPalHttpClient(environment);
}

exports.createOrder = async (amount, currency = 'GBP', referenceId = null) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: referenceId || 'default-reference-id',
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                },
            ],
            application_context: {
                user_action: 'PAY_NOW',
                return_url: 'http://localhost:3000/payment-success',
                cancel_url: 'http://localhost:3000',
            },
        });
        const response = await client.execute(request);
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

exports.capturePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        console.error("Error capturing PayPal payment:", error.message);
        throw new Error("Failed to capture PayPal payment");
    }
};

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
