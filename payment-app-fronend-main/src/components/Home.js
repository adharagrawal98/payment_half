// src/components/Home.js
import React from 'react';
import backgroundImage from '../assets/home1.jpg';
import donateImage from '../assets/donate_image.jpg'; // Correctly import the image
import qrImage from '../assets/QR_image.jpg';
import shelterImage from '../assets/shelter_image.jpg';
import { useNavigate } from 'react-router-dom'; // Change to useNavigate

const charityDetails = {
    name: "Local Homeless Shelter",
    address: "123 Shelter Lane, Cityville",
    description: "A place for homeless individuals to find temporary shelter."
};

const Home = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center">
            {/* Background Image Section */}
            <div className="relative h-screen w-full bg-no-repeat bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
                {/* Overlay Text */}
                <div className="absolute inset-0 flex flex-col items-end justify-start text-right p-6 md:p-20 bg-black bg-opacity-40">
                    <h1 className="text-3xl sm:text-l md:text-5xl lg:text-6xl font-extrabold mt-1 mb-3"
                        style={{ color: '#5fedc0', textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)' }}>
                        Give Shelter, Give Hope
                    </h1>
                    <h3 className="text-lg sm:text-xl md:text-2xl mb-4 font-semibold italic tracking-wider"
                        style={{ color: '#5fedc0', textShadow: '1px 1px 8px rgba(0, 0, 0, 0.4)' }}>
                        Empower the homeless with your donation.
                    </h3>
                    <p className="text-sm sm:text-lg md:text-xl font-light tracking-wide leading-relaxed max-w-xs sm:max-w-md md:max-w-lg"
                        style={{ color: '#5fedc0', textShadow: '1px 1px 6px rgba(0, 0, 0, 0.3)' }}>
                        Donate directly to shelters and provide immediate relief to those in need.
                    </p>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="w-full bg-gray-100 py-20 flex flex-col items-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-10 text-gray-700">How We Work?</h2>

                {/* Steps Container */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
                    {/* Step 1: Donate */}
                    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md w-64">
                        <img
                            src={donateImage} // Use the imported image here
                            alt="Donate illustration"
                            className="w-50 h-60 mb-4 object-cover" // Adjust width and height as needed
                        />
                        <div className="text-3xl font-semibold mb-4">Donate</div>
                        <p className="text-gray-600"><strong>Choose</strong> a shelter and <strong>Donate</strong> directly to support the homeless community</p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:block text-3xl font-bold text-gray-500">→</div>

                    {/* Step 2: Receive QR Code */}
                    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md w-64">
                        <img
                            src={qrImage} // Use the imported image here
                            alt="QR Code"
                            className="w-50 h-52 mb-4 object-cover" // Adjust width and height as needed
                        />
                        <div className="text-3xl font-semibold mb-4">Receive QR Code</div>
                        <p className="text-gray-600">After donating, <strong>Receive</strong> a unique QR code to <strong>Share</strong> with someone in need</p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:block text-3xl font-bold text-gray-500">→</div>

                    {/* Step 3: Access Shelter */}
                    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md w-64">
                        <img
                            src={shelterImage} // Use the imported image here
                            alt="homeless receives shelter without any efforts"
                            className="w-59 h-60 mb-4 object-cover" // Adjust width and height as needed
                        />
                        <div className="text-3xl font-semibold mb-4">Shelter</div>
                        <p className="text-gray-600">Individuals in need can <strong>Access Shelter</strong> through the shared QR Code at our facilities</p>
                    </div>
                </div>

                {/* Find Shelters Button */}
                <div className="mt-10">
                    <button
                        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition duration-200"
                        onClick={() => navigate('/donor-map', { state: { charity: charityDetails } })} // Update to use navigate
                    >
                        Find Shelters Nearby to Donate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;