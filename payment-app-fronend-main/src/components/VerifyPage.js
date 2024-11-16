import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Importing Firebase configuration
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
const VerifyPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate(); // Use useNavigate hook for redirection

    const [scannedData, setScannedData] = useState(null);
    const [charityData, setCharityData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (state && state.scannedData && state.charityData) {
            setScannedData(state.scannedData);
            setCharityData(state.charityData);
        } else {
            navigate('/'); // Redirect to dashboard if no data is passed
        }
    }, [state, navigate]);

    useEffect(() => {
        if (scannedData && scannedData.charityID) {
            const fetchCharityData = async () => {
                try {
                    // Fetch charity data using the Firestore document ID (charityID)
                    const charityDoc = doc(db, 'charityDetails', scannedData.charityID);
                    const charitySnapshot = await getDoc(charityDoc);

                    if (charitySnapshot.exists()) {
                        setCharityData(charitySnapshot.data()); // Set the charity data
                    } else {
                        console.error("Charity not found!");
                    }
                } catch (error) {
                    console.error("Error fetching charity details:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCharityData();
        }
    }, [scannedData]);

    async function generateAccessToken() {
        try {
            const response = await axios({
                url: `https://api-m.sandbox.paypal.com/v1/oauth2/token`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    username: 'AYs2e7dECSrKaXDDZxN9lsY6V8S_u4BO0y1zxTa3TF5LZNm6yzesYBwLxmP43gVh38nyjUIoUp87hEVT',
                    password: 'EE6KDKqT11ewGaHrExhTnGPcz9J1GEkc1Ocs9BCEY7mhyu-P7xsmQqiXAvmiNdkmYmNQi055FOuDweM_',
                },
                data: 'grant_type=client_credentials', // Required payload
            });

            console.log("Access Token Generated:", response);
            return response.data.access_token;
        } catch (error) {
            console.error("Error generating access token:", error.response?.data || error.message);
            throw new Error("Failed to generate access token");
        }
    }

    const getOrderDetails = async () => {
        try {
            console.log("Fetching order details for orderID:", scannedData.orderID);
            const accessToken = await generateAccessToken();

            const response = await axios({
                url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${scannedData.orderID}`,
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log("Order Details:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching order details:", error.response?.data || error.message);
            if (error.response?.status === 404) {
                console.error("Order not found. Please check the orderID or create a new order.");
            }
            throw new Error("Failed to fetch order details");
        }
    };
    const handleAcceptPayment = async () => {
        try {
            console.log("Sending orderID:", scannedData.orderID);
            const accessToken = await generateAccessToken();

            const response = await axios({
                url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${scannedData.orderID}/capture`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: null,
            });

            console.log("Capture Payment Response:", response.data);

            if (response.data.status === 'COMPLETED') {
                alert('Payment captured successfully!');
            } else {
                alert('Error capturing payment: ' + JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Error capturing payment:", error.response?.data || error.message);
            alert('Error capturing payment.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading payment confirmation...</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-semibold mb-6">Charity Information</h2>

            {/* Scanned Data and Charity Info for Display */}
            <div className="flex space-x-6">
                {/* Scanned Data Card */}
                <div className="bg-white p-6 rounded-lg shadow-md flex-1">
                    <h3 className="text-xl font-semibold mb-4">Scanned Data</h3>
                    <p><strong>Charity Name:</strong> {charityData.charityName}</p>
                    <p><strong>Registration Number:</strong> {scannedData.registrationNumber}</p>
                    <p><strong>Shelter ID:</strong> {scannedData.charityID}</p>
                    <p><strong>Order ID:</strong> {scannedData.orderID}</p>
                </div>

                {/* Charity Data Card */}
                <div className="bg-white p-6 rounded-lg shadow-md flex-1">
                    <h3 className="text-xl font-semibold mb-4">Charity Data</h3>
                    <p><strong>Charity Name:</strong> {charityData.charityName}</p>
                    <p><strong>Registration Number:</strong> {charityData.registrationNumber}</p>
                    <p><strong>Shelter ID:</strong> {scannedData.charityID}</p>
                    <p><strong>Order ID:</strong> {charityData.orderID}</p>
                </div>
            </div>

            {/* Accept Payment Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={getOrderDetails}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                    Accept Payment
                </button>
            </div>
        </div>
    );
};

export default VerifyPage;