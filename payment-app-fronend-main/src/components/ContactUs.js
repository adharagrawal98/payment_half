import React from 'react';

const ContactUs = () => {
    const companyPolicies = [
        "Your query will be addressed within 24 hours.",
        "We respect your privacy and will not share your information.",
        "For urgent queries, please contact us during working hours."
    ];

    const workingHours = "Monday to Friday, 9 AM - 5 PM";

    const handleEmailClick = () => {
        const subject = encodeURIComponent("Customer Query");
        const body = encodeURIComponent("Please enter your query here...");
        const email = "adiagrawal323@gmail.com";

        // Open the default email client
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>

            <h3 className="text-xl font-semibold mb-2">Company Policies:</h3>
            <ul className="list-disc ml-5 mb-4">
                {companyPolicies.map((policy, index) => (
                    <li key={index}>{policy}</li>
                ))}
            </ul>

            <h3 className="text-xl font-semibold mb-2">Customer Care Working Hours:</h3>
            <p>{workingHours}</p>

            <div className="mt-6">
                <button
                    onClick={handleEmailClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600"
                >
                    Click Here to Send Us Your Query
                </button>
            </div>
        </div>
    );
};

export default ContactUs;