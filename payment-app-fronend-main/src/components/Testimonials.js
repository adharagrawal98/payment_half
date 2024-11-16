// Testimonials.js
import React from 'react';
import testimonialImage1 from '../assets/image1.jpg'; // Update paths to your images
import testimonialImage2 from '../assets/image2.jpg';
import testimonialImage3 from '../assets/image3.jpg';
import testimonialImage4 from '../assets/image4.jpg';

const testimonialsData = [
    {
        id: 1,
        name: 'John Doe',
        message: 'This charity changed my life! I am forever grateful for the support I received.',
        image: testimonialImage1,
    },
    {
        id: 2,
        name: 'Jane Smith',
        message: 'Thanks to this organization, I found a safe place to stay. Their help was invaluable.',
        image: testimonialImage2,
    },
    {
        id: 3,
        name: 'Robert Johnson',
        message: 'The assistance I received allowed me to get back on my feet. Highly recommend their services!',
        image: testimonialImage3,
    },
    {
        id: 4,
        name: 'Emily Davis',
        message: 'A wonderful charity that truly cares for the homeless. Thank you for everything!',
        image: testimonialImage4,
    },
];

const Testimonials = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {testimonialsData.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="border rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
                    >
                        {/* Increased the height of the image */}
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-60 object-cover" />
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                            <p className="text-gray-700">{testimonial.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;