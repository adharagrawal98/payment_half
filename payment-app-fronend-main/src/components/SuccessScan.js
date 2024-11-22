import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const SuccessScan = () => {
    const navigate = useNavigate();

    const [charityName, setCharityName] = useState('');
    const [amount, setAmount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharityDetails = async () => {
            try {
                const db = getFirestore(); // Assume Firestore is already initialized
                const charityID = localStorage.getItem('charityID');

                if (!charityID) {
                    console.error('Charity ID not found in localStorage');
                    return;
                }

                const charityDocRef = doc(db, 'charityDetails', charityID);
                const charityDoc = await getDoc(charityDocRef);

                if (charityDoc.exists()) {
                    const charityData = charityDoc.data();
                    setCharityName(charityData.charityName || 'Unknown Charity');
                    setAmount(charityData.ratePerDay || 0);
                } else {
                    console.error('Charity document does not exist');
                }
            } catch (error) {
                console.error('Error fetching charity details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharityDetails();

        const timer = setTimeout(() => {
            navigate('/shelter-dashboard');
        }, 5000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-600">Loading payment details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
                {/* Animated tick */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="green"
                    className="w-24 h-24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4"
                        className="stroke-current animate-draw-tick"
                        style={{ strokeDasharray: "24", strokeDashoffset: "0" }}
                    />
                </svg>

                {/* Text below tick */}
                <h1 className="text-4xl font-bold text-green-700 mt-6">Payment Successful!</h1>
                <p className="text-lg text-gray-700 mt-4">
                    Payment of <span className="font-semibold">£{amount}</span> has been successfully credited to <span className="font-semibold">{charityName}</span>.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Redirecting to shelter dashboard in 5 seconds...
                </p>
            </div>
        </div>
    );
};

export default SuccessScan;