import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode';

const PaymentConfirmationPage = () => {
    const location = useLocation();
    const printRef = useRef();
    const [charity, setCharity] = useState(null);
    const [orderID, setOrderID] = useState(null);
    const [charityID, setCharityID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrCodeData, setQrCodeData] = useState(null);

    useEffect(() => {

        const charityIDParam = localStorage.getItem("charityID");
        const orderId = localStorage.getItem("paypalOrderId");

        console.log("charityID", charityIDParam);
        console.log("orderId", orderId);

        setOrderID(orderId);
        setCharityID(charityIDParam);


        if (charityIDParam) {
            const fetchCharity = async () => {
                try {
                    const charityDoc = doc(db, 'charityDetails', charityIDParam);
                    const charityData = await getDoc(charityDoc);

                    if (charityData.exists()) {
                        setCharity(charityData.data());
                    } else {
                        console.error("Charity not found!");
                    }
                } catch (error) {
                    console.error("Error fetching charity details:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCharity();
        } else {
            console.error('No charityID found in URL');
        }
    }, [location]);

    // Generate the QR code image URL with authorizationID, charityID, and registrationNumber
    const generateQrCodeData = (orderID, charityID, registrationNumber) => {
        const qrContent = `localhost:3000?orderID=${orderID}&charityID=${charityID}&registrationNumber=${registrationNumber}`

        QRCode.toDataURL(qrContent, { errorCorrectionLevel: 'H' }, (err, url) => {
            if (err) {
                console.error("Error generating QR code:", err);
                return;
            }
            setQrCodeData(url);
        });
    };

    useEffect(() => {
        // Generate QR code when authorizationID, charityID, and registrationNumber are available
        if (orderID && charityID && charity?.registrationNumber) {
            generateQrCodeData(orderID, charityID, charity.registrationNumber);
        }
    }, [orderID, charityID, charity]);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Receipt</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin: 0;
                            padding: 20px;
                        }
                        .print-container {
                            max-width: 500px;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            background-color: #fff;
                            text-align: center;
                        }
                        .qr-code {
                            width: 250px;
                            height: 250px;
                            margin: 20px auto;
                        }
                        @media print {
                            .print-button {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        ${printContents}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading payment confirmation...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div ref={printRef} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-center">Payment Confirmation</h1>

                {/* QR Code Section */}
                <div className="flex items-center justify-center w-full mb-6">
                    {qrCodeData ? (
                        <img
                            src={qrCodeData}
                            alt="QR Code"
                            className="w-64 h-64"
                        />
                    ) : (
                        <p className="text-gray-500">QR Code will appear here.</p>
                    )}
                </div>

                {/* Charity Details */}
                {charity ? (
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold mb-2">{charity.charityName}</h2>
                        <p className="text-gray-700 mb-1">
                            <strong>Address:</strong> {charity.address}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <strong>Registration Number:</strong> {charity.registrationNumber}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mb-6">Error loading charity details.</p>
                )}

                {/* Instructions Section */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Instructions for Homeless:</h3>
                    <p className="text-gray-600 mb-5">
                        <strong>Show this QR code at the charity to get shelter.</strong>
                    </p>
                </div>

                {/* Bottom-right Share Message */}
                <p className="text-gray-500 text-xs font-semibold text-right max-w-xs mb-4">
                    **<strong>Instructions for Donor:</strong> Share this QR code with someone in need, and they can use it to get shelter at our partnered charity.**
                </p>

                {/* Print Receipt Button */}
                <button
                    onClick={handlePrint}
                    className="print-button bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200 mt-4"
                >
                    Print Receipt to Share with Someone in Need
                </button>
            </div>
        </div>
    );
};

export default PaymentConfirmationPage;