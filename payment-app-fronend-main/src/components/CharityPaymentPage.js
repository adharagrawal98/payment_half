import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { QRCodeCanvas } from 'qrcode.react';  // Import QRCodeCanvas
import PayPalButton from './PayPalButton';

const CharityPaymentPage = () => {
    const { id } = useParams();
    const [shelter, setShelter] = useState(null);
    const [showPayPal, setShowPayPal] = useState(false);
    const [authorizationID, setAuthorizationID] = useState(null);  // State to hold the authorization ID
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShelter = async () => {
            try {
                const shelterDoc = doc(db, "charityDetails", id);
                const shelterData = await getDoc(shelterDoc);

                if (shelterData.exists()) {
                    setShelter(shelterData.data());
                } else {
                    console.error("Shelter not found!");
                }
            } catch (error) {
                console.error("Error fetching shelter details:", error);
            }
        };

        fetchShelter();
    }, [id]);

    useEffect(() => {
        if (showPayPal && window.paypal) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{
                            amount: {
                                value: shelter.ratePerDay,
                            },
                        }],
                    });
                },
                onApprove: async (data, actions) => {
                    const orderID = data.orderID;
                    const authorization = await actions.order.authorize();
                    const authorizationID = authorization.purchase_units[0].payments.authorizations[0].id;

                    console.log("Order ID:", orderID);  // Log the orderID
                    console.log("Authorization ID:", authorizationID);  // Log the authorizationID

                    // Store orderID and authorizationID in Firestore
                    await updateDoc(doc(db, "charityDetails", id), {
                        orderID: orderID,
                        authorizationID: authorizationID,
                        paymentStatus: "authorized",
                    });

                    // Set the authorizationID in state
                    setAuthorizationID(authorizationID);

                    // Redirect to payment confirmation page with authorizationID as query parameter
                    navigate(`/payment-confirmation?charityID=${id}&authorizationID=${authorizationID}&orderID=${orderID}`);
                },
                onError: (err) => {
                    console.error("Error with PayPal payment:", err);
                },
            }).render("#paypal-button-container");
        }
    }, [showPayPal, shelter, navigate]);

    if (!shelter) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading charity details...</div>
            </div>
        );
    }

    console.log("Authorization ID: ", authorizationID);  // Debugging line to check the value of authorizationID

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">{shelter.charityName}</h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-700">Address:</p>
                        <p className="text-md text-gray-600">{shelter.address}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-700">Rate per Day:</p>
                        <p className="text-md text-gray-600">£{shelter.ratePerDay}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-700">Beds Available Today:</p>
                        <p className="text-md text-gray-600">{shelter.bedsAvailable}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <PayPalButton amount={shelter.ratePerDay} charityId="uaegrfiuaer" />

                    <button
                        className="w-full py-3 mt-4 px-6 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
                        onClick={() => navigate("/donor-map")}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharityPaymentPage;