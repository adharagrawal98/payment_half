import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessScan = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { charityName, amount } = location.state || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/shelter-dashboard');
        }, 5000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, [navigate]);

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
                    Payment of <span className="font-semibold">${amount}</span> has been successfully credited to <span className="font-semibold">{charityName}</span>.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Redirecting to shelter dashboard in 5 seconds...
                </p>
            </div>
        </div>
    );
};

export default SuccessScan;