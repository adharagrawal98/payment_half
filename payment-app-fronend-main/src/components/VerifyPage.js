import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyPage = () => {
    const navigate = useNavigate(); // Use useNavigate hook for redirection
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [scannedData, setScannedData] = useState({
        orderID: '',
        charityID: '',
        registrationNumber: ''
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderID = params.get('orderID');
        const charityID = params.get('charityID');
        const registrationNumber = params.get('registrationNumber');

        setScannedData({
            orderID,
            charityID,
            registrationNumber
        });
        setLoading(false);

    }, [location, navigate]);

    if (loading) {
        return (<div>loading data</div>)
    }

    const getOrderDetails = () => {
        window.alert("capture payment")
    } 

    return (
        <div className="p-4">
            <h2 className="text-3xl font-semibold mb-6">Charity Information</h2>

            {/* Scanned Data and Charity Info for Display */}
            <div className="flex space-x-6">
                {/* Scanned Data Card */}
                <div className="bg-white p-6 rounded-lg shadow-md flex-1">
                    <h3 className="text-xl font-semibold mb-4">Scanned Data</h3>
                    {/* <p><strong>Charity Name:</strong> {charityData.charityName}</p> */}
                    <p><strong>Registration Number:</strong> {scannedData.registrationNumber}</p>
                    <p><strong>Shelter ID:</strong> {scannedData.charityID}</p>
                    <p><strong>Order ID:</strong> {scannedData.orderID}</p>
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