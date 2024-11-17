import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, InfoWindowF, Marker } from '@react-google-maps/api'; // Import InfoWindowF here
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import SearchLocationInput from '../components/GooglePlacesApi';
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

// Function to calculate the distance between two lat/lng points (in meters)
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // returns the distance in meters
};

const DonorMap = () => {
    const navigate = useNavigate();

    // State for user-selected location and shelter data
    const [selectedLocation, setSelectedLocation] = useState({ lat: 51.509865, lng: -0.118092 }); // Default to London
    const [shelters, setShelters] = useState([]);  // Store all shelter data here
    const [selectedShelter, setSelectedShelter] = useState(null); // Selected shelter for InfoWindow
    const [zoomLevel, setZoomLevel] = useState(12); // Default zoom level
    const [googleLoaded, setGoogleLoaded] = useState(false);  // Track when Google API is loaded
    const [selectedAddress, setSelectedAddress] = useState(''); // State for selected address

    // Fetch shelters from Firestore on component mount
    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const shelterCollection = collection(db, "charityDetails");
                const shelterSnapshot = await getDocs(shelterCollection);
                const shelterData = shelterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setShelters(shelterData);
                localStorage.setItem("charityID", shelterData.id);
            } catch (error) {
                console.error("Error fetching shelters:", error);
            }
        };

        fetchShelters();
    }, []);

    // Function to handle navigation to the selected shelter's page
    const handleDonateNow = (shelterId) => {
        navigate(`/shelter/${shelterId}`);
    };

    // Filter shelters based on distance to selected location
    const filteredShelters = shelters.filter(shelter => {
        if (shelter.lat && shelter.lng && !isNaN(shelter.lat) && !isNaN(shelter.lng)) {
            const distance = getDistance(selectedLocation.lat, selectedLocation.lng, shelter.lat, shelter.lng);
            return distance < 5000; // Only shelters within 5 km (5000 meters)
        }
        return false;
    });

    // Update zoom and map center when a location is selected
    const handleLocationChange = (location, address) => {
        setSelectedLocation(location);
        setSelectedAddress(address); // Set the address when location changes
        setZoomLevel(14); // Zoom in closer when a new location is selected
    };

    // Handle marker click and open the InfoWindow
    const handleMarkerClick = (shelter) => {
        if (selectedShelter && selectedShelter.id === shelter.id) {
            setSelectedShelter(null); // If clicking on the same marker, close the InfoWindow
        } else {
            setSelectedShelter(shelter); // Otherwise, open the InfoWindow
        }
    };

    // Check if Google Maps is fully loaded before rendering markers
    useEffect(() => {
        if (window.google) {
            setGoogleLoaded(true);  // Mark Google API as loaded
        }
    }, []);

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-3xl font-bold mb-4">Find Shelters Nearby</h2>

            {/* Location Search */}
            <div className="mb-4 w-full max-w-md">
                <SearchLocationInput
                    setSelectedLocation={handleLocationChange}
                    setSelectedAddress={setSelectedAddress}
                />
            </div>

            {/* Display selected address */}
            {selectedAddress && (
                <div className="mb-4 text-lg">
                    <strong>Selected Address:</strong> {selectedAddress}
                </div>
            )}

            {/* Map Display */}
            <div className="w-full h-96 mb-4">
                <LoadScript
                    googleMapsApiKey={REACT_APP_GOOGLE_MAPS_KEY}
                    libraries={['places']}
                    onLoad={() => setGoogleLoaded(true)}
                >
                    <GoogleMap
                        mapContainerStyle={{ height: "100%", width: "100%" }}
                        center={selectedLocation}
                        zoom={zoomLevel}
                    >
                        {googleLoaded && filteredShelters.map((shelter, index) => (
                            <Marker
                                key={index}
                                position={{ lat: shelter.lat, lng: shelter.lng }}
                                onMouseOver={() => handleMarkerClick(shelter)} // Open InfoWindow on click
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                }}
                            >
                                {/* InfoWindowF inside Marker */}
                                {selectedShelter && selectedShelter.id === shelter.id && (
                                    <InfoWindowF
                                        position={{ lat: shelter.lat, lng: shelter.lng }}
                                        onCloseClick={() => setSelectedShelter(null)} // Close InfoWindow on close button click
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold">{shelter.charityName}</h3>
                                            <p><strong>Address:</strong> {shelter.address}</p>
                                            <p><strong>Contact Number:</strong> {shelter.contactNumber}</p>
                                            <p><strong>Registration Number:</strong> {shelter.registrationNumber}</p>
                                            <p><strong>Beds Available:</strong> {shelter.bedsAvailable}</p>
                                            <p><strong>Rate per Day:</strong> £{shelter.ratePerDay}</p>
                                            <button
                                                onClick={() => handleDonateNow(shelter.id)}
                                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Donate Now
                                            </button>
                                        </div>
                                    </InfoWindowF>
                                )}
                            </Marker>
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>

            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go Back
            </button>
        </div>
    );
};

export default DonorMap;