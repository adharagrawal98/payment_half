import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authorizePayment = async () => {
            try {
                // Get the orderId from localStorage
                const orderId = localStorage.getItem("paypalOrderId");

                if (!orderId) {
                    throw new Error("No PayPal Order ID found. Payment cannot be authorized.");
                }

                // Call the backend API to authorize the payment
                const response = await axios.post(
                    `http://localhost:5001/api/paypal/authorize-payment/${orderId}`
                );

                console.log("Payment Authorization Response:", response.data);

                // Update success state and navigate to a Thank You page
                setSuccess(true);
                setTimeout(() => {
                    navigate("/verify-page");
                }, 3000);
            } catch (err) {
                console.error("Error authorizing payment:", err);
                setError("Failed to authorize payment. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        authorizePayment();
    }, [navigate]);

    if (loading) {
        return <p>Processing your payment...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (success) {
        return <p style={{ color: "green" }}>Payment authorized successfully! Redirecting...</p>;
    }

    return null;
};

export default PaymentSuccess;
