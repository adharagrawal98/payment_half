import React from 'react';

const DonorDetailsForm = ({ donorData, handleInputChange, handleFormSubmit }) => {
    return (
        <form className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleFormSubmit}>
            <h2 className="text-2xl font-semibold mb-4">Donor Details</h2>

            <label className="block mb-2">
                Full Name:
                <input
                    type="text"
                    name="fullName"
                    value={donorData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <label className="block mb-2">
                Mobile Number:
                <input
                    type="tel"
                    name="mobileNumber"
                    value={donorData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </label>

            <label className="block mb-2">
                Email Address:
                <input
                    type="email"
                    name="email"
                    value={donorData.email} // This will be set in the parent component
                    readOnly // Make it read-only since it's fetched from Google
                    className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed" // Optional: styling for a read-only field
                    required
                />
            </label>

            <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
                Save Details
            </button>
        </form>
    );
};

export default DonorDetailsForm;