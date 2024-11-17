import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    setTimeout(() => {
        loading = false;
    }, 1000);

    useEffect(() => {
        setLoading(false);
        setTimeout(() => {
            navigate("/payment-confirmation");
        }, 3000);
    }, [loading]);

    if (loading) {
        return <p>Processing your payment...</p>;
    }

    return <p style={{ color: "green" }}>Payment authorized successfully! Redirecting...</p>;
};

export default PaymentSuccess;
