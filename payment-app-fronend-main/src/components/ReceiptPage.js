import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ReceiptPage = () => {
    const navigate = useNavigate();
    const printRef = useRef(); // Ref for the printable section

    // Stable reference for charity details using useMemo
    const charity = useMemo(() => ({
        name: "Helping Hands Shelter",
        address: "123 Main St, Cityville",
        description: "Providing shelter and support for those in need."
    }), []);

    // Redirect if no charity details are available
    useEffect(() => {
        if (!charity) {
            navigate('/'); // Redirect to the home page or relevant route
        }
    }, [charity, navigate]);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;

        // Create a new window
        const printWindow = window.open('', '_blank');

        // Write HTML content into the new window
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Receipt</title>
                    <style>
                        /* Add necessary styles here for the print layout */
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
                        }
                        .text-center {
                            text-align: center;
                        }
                        .text-gray-700 {
                            color: #4a4a4a;
                        }
                        .font-semibold {
                            font-weight: 600;
                        }
                        .mb-6 {
                            margin-bottom: 1.5rem;
                        }
                        /* Additional styling for print */
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        ${printContents}
                    </div>
                </body>
            </html>
        `);

        // Close the document and trigger print
        printWindow.document.close();
        printWindow.print();

        // Close the new window after printing
        printWindow.close();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div ref={printRef} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-center">Donation Receipt</h1>

                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-gray-200 rounded mb-6 flex items-center justify-center">
                    <p className="text-gray-500">QR Code will be displayed here.</p>
                </div>

                {/* Charity Details */}
                {charity ? (
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold mb-2">{charity.name}</h2>
                        <p className="text-gray-700 mb-1">
                            <strong>Address:</strong> {charity.address}
                        </p>
                        <p className="text-gray-700 mb-1">
                            <strong>Description:</strong> {charity.description}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mb-6">No charity selected.</p>
                )}

                {/* Instructions Section */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions for Donor</h3>
                    <p className="text-gray-600">
                        <strong>Show this QR code at the charity's location to receive services.</strong>
                    </p>
                </div>

                {/* Bottom-right Share Message inside the main div */}
                <p className="text-gray-500 text-xs font-semibold text-right max-w-xs mb-4">
                    **Share this QR code with someone in need, and they can use it to reach the charity.**
                </p>

                {/* Print Button at the bottom */}
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200 mt-4"
                >
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default ReceiptPage;