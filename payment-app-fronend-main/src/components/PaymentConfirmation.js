import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentConfirmation = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("Processing payment...");
    const orderId = localStorage.getItem("paypalOrderId");

    // get Order id form localStorage.setItem("paypalOrderId", orderId);

    useEffect(() => {
        const authorizePayment = async () => {
            try {
                // Call the backend API to authorize the payment
                const response = await axios.post(
                    `http://localhost:5001/api/paypal/authorize-payment/:orderId`,
                    { orderId }
                );

                const { authorizationId, status: paymentStatus } = response.data;

                // Update status based on response
                if (paymentStatus === "COMPLETED" || paymentStatus === "AUTHORIZED") {
                    setStatus("Payment successful!");
                } else {
                    setStatus("Payment authorized but not completed.");
                }

                console.log("Authorization ID:", authorizationId);
            } catch (err) {
                console.error("Error authorizing PayPal payment:", err);
                setStatus("Payment failed. Please try again.");
            }
        };

        if (orderId) {
            authorizePayment();
        } else {
            setStatus("Invalid payment session. Please try again.");
        }
    }, [orderId]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{status}</h1>
        </div>
    );
};

export default PaymentConfirmation;
