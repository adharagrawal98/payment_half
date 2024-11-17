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
            {/* <div className="mt-6 text-center">
                <button
                    onClick={getOrderDetails}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                    Accept Payment
                </button>
            </div> */}
        </div>
    );
};

export default VerifyPage;