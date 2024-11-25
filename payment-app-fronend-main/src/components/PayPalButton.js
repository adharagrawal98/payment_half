import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { nanoid } from 'nanoid';
const PayPalButton = ({ amount, charityId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const createOrder = async () => {
        try {
            setLoading(true);
            setError(null);


            console.log("amount", amount);
            console.log("charityId", charityId);

            // Call the backend API to create the PayPal order
            const response = await axios.post(
                "http://localhost:5001/api/paypal/create-order",
                {
                    amount,
                    charityId,
                    "currency": "GBP"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "User-Id" : localStorage.getItem("userId"),
                    },
                }
            );

            const { orderId, approvalLink } = response.data;
            localStorage.setItem("paypalOrderId", orderId);
            window.location.href = approvalLink;

        } catch (err) {
            console.error("Error creating PayPal order:", err);
            setError("Failed to initiate PayPal payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
                onClick={createOrder}
                disabled={loading}
                style={{
                    padding: "10px 20px",
                    width: "700px",
                    backgroundColor: "#0070ba",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {loading ? "Processing..." : `Pay £${amount} with PayPal`}
            </button>
        </div>
    );
};

export default PayPalButton;
