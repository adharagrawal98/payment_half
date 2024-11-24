import React, { useState } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import Swal from 'sweetalert2';
import SearchLocationInput from '../components/GooglePlacesApi';
import MapComponent from '../components/Map';

const CharityDetailsForm = ({ charityData, handleInputChange }) => {
    const db = getFirestore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        lat: 51.509865, // Default latitude
        lng: -0.118092, // Default longitude
    });
    const [selectedAddress, setSelectedAddress] = useState("");

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                // Include lat and lng in charityData before saving
                const charityDetailsToSave = {
                    ...charityData,
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng,
                };

                await setDoc(doc(db, "charityDetails", user.uid), charityDetailsToSave);
                Swal.fire({
                    title: 'Details Saved',
                    text: 'Your charity details have been saved successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay',
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                throw new Error("User not authenticated");
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Could not save charity details. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleAddressSelect = (address) => {
        handleInputChange({ target: { name: "address", value: address } });
        setSelectedAddress(address);
        // Do not close the modal here
    };

    const confirmLocation = () => {
        setIsModalOpen(false);
        handleInputChange({ target: { name: "address", value: selectedAddress } });
    };

    return (
        <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" onSubmit={submitForm}>
            <h2 className="text-2xl font-semibold mb-4">Charity Details</h2>

            <label className="block mb-2">
                Charity Name:
                <input
                    type="text"
                    name="charityName"
                    value={charityData.charityName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <label className="block mb-2">
                Contact Number:
                <input
                    type="tel"
                    name="contactNumber"
                    value={charityData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <label className="block mb-2">
                Total Number of Beds Available:
                <input
                    type="number"
                    name="bedsAvailable"
                    value={charityData.bedsAvailable}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <label className="block mb-2">
                Rate per Day per Bed:
                <input
                    type="number"
                    name="ratePerDay"
                    value={charityData.ratePerDay}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <label className="block mb-2">
                Charity Registration Number:
                <input
                    type="text"
                    name="registrationNumber"
                    value={charityData.registrationNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <label className="block mb-2 relative">
                Address:
                <textarea
                    name="address"
                    value={charityData.address || selectedAddress}
                    onChange={handleInputChange}
                    className="w-full min-w-[300px] p-2 border rounded"
                    required
                />
                <button
                    type="button"
                    onClick={toggleModal}
                    className="mt-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Find Your Location Here
                </button>
            </label>

            <label className="block mb-4">
                PayPal Client ID:
                <input
                    type="text"
                    name="bankAccountDetails"
                    value={charityData.paypalClientId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>
            <label className="block mb-4">
                PayPal Client SECRET:
                <input
                    type="text"
                    name="bankAccountDetails"
                    value={charityData.paypalSecret}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
                Save Details
            </button>

            {/* Modal for Google Maps */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-lg relative">
                        <button
                            onClick={toggleModal}
                            className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-900"
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-semibold mb-2">Select Your Location</h3>
                        <SearchLocationInput
                            setSelectedLocation={setSelectedLocation}
                            setSelectedAddress={handleAddressSelect}
                        />
                        <MapComponent selectedLocation={selectedLocation} />
                        {/* Display the selected address in full width */}
                        <div className="mt-4 w-full">
                            <label className="block mb-2">Selected Address:</label>
                            <textarea
                                value={selectedAddress}
                                readOnly
                                className="w-full h-10 p-2 border rounded"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={confirmLocation}
                            className="mt-4 w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Confirm Location
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};

export default CharityDetailsForm;