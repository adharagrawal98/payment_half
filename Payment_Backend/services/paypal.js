const paypal = require('@paypal/checkout-server-sdk');

// Set up PayPal environment (Sandbox or Live)
const environment = new paypal.core.SandboxEnvironment(
    clientId = process.env.PAYPAL_CLIENT_ID || 'AYs2e7dECSrKaXDDZxN9lsY6V8S_u4BO0y1zxTa3TF5LZNm6yzesYBwLxmP43gVh38nyjUIoUp87hEVT',
    clientSecret = process.env.PAYPAL_SECRET || 'EE6KDKqT11ewGaHrExhTnGPcz9J1GEkc1Ocs9BCEY7mhyu-P7xsmQqiXAvmiNdkmYmNQi055FOuDweM_'
);


// PAYPAL_CLIENT_ID = AS0mIYrjAJnBjcF8Qx8xvjLGmjy4QOliUiJn_iNIiX2T5Sb7I6Yz3RSUUQ392QU-6rdY2KOL4TEOD_dD
// PAYPAL_SECRET = EL6BrTwTrmgT2tZ-0ksLsfUBFeXikbYkr2V0Nvj_hSER93XuWjXFsxEEhrr7mxXmB2cnN8zqCLIBH5z4
//  Cay
// PAYPAL_CLIENT_ID = AS5b882r4vsM-Hfg0WnZ_8fuvsbDax_qTvUPCQF7X6Rcbuh8VkWN00PyWqfajo-QX0p-kXcJKexBMrlx
// PAYPAL_SECRET = EHdyXjlfCnikEQTdKZz15WxcPPI6k7q_nuPaZLtIt0tFyob7TcGgeCAaCNFkVwnxITcaDmHYv9KQtf6B
console.log("env", environment)
const client = new paypal.core.PayPalHttpClient(environment);

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
