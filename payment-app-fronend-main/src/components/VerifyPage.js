import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [scannedData, setScannedData] = useState(null);
    const [charityData, setCharityData] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyData = async () => {
            setLoading(true); // Start loading
            const charityIDParam = localStorage.getItem("charityID");

            if (location.state) {
                const { scannedData: scannedData, charityData: charityData } = location.state;

                setScannedData(scannedData);
                setCharityData(charityData);

                console.log("Scanned Data:", scannedData);
                console.log("Charity Data:", charityData);
                console.log("charityID (from UID):", charityIDParam);

                if (
                    scannedData.charityID === charityIDParam &&
                    scannedData.registrationNumber === charityData.registrationNumber
                ) {
                    setVerificationResult({
                        success: true,
                        message: "The QR code has been successfully verified.",
                    });
                } else {
                    setVerificationResult({
                        success: false,
                        message: "This QR code does not belong to this charity.",
                    });
                }
            } else {
                setError("No data provided for verification.");
            }

            setLoading(false); // Stop loading
        };

        verifyData();
    }, [location]);

    const getOrderDetails = async () => {
        try {
            const orderId = localStorage.getItem("paypalOrderId");
            console.log("Order ID being sent to the backend:", orderId);

            const response = await fetch(`http://localhost:5001/api/paypal/capture-payment/${orderId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error capturing payment: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("PayPal capture response:", result);

            // Redirect to success page with donation details
            navigate("/success-scan", {
                state: {
                    charityName: charityData.charityName,
                    amount: charityData.ratePerDay,
                },
            });
        } catch (error) {
            console.error("Error during payment capture:", error.message);
            window.alert("Failed to capture payment. Please try again.");
        }
    };

    if (loading) {
        return <div>Verifying data...</div>;
    }

    if (error) {
        return (
            <div className="p-4">
                <h2 className="text-3xl font-semibold mb-6">Error</h2>
                <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
                    <p className="text-lg">{error}</p>
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-semibold mb-6">Verification Result</h2>

            {verificationResult && (
                <div
                    className={`mt-6 p-4 rounded-lg shadow-md ${verificationResult.success
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    <p className="text-lg">{verificationResult.message}</p>
                </div>
            )}
            {verificationResult?.success && (
                <div className="mt-6 text-center">
                    <button
                        onClick={getOrderDetails}
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                    >
                        Accept Payment
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyPage;