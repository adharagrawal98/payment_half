import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const MapComponent = ({ selectedLocation }) => {
  // Load the Google Maps API with the required libraries
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ["places"], // Specify the libraries you need
  });

  // Handle load error
  if (loadError) {
    console.error("Map loading error:", loadError);
    return <div style={{ color: "red" }}>Error loading maps. Please try again later.</div>;
  }

  // Show loading indicator while the map is being loaded
  if (!isLoaded) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Maps...</div>;
  }

  return (
    <div style={{ marginTop: "50px" }}>
      <GoogleMap
        mapContainerStyle={{
          height: "400px", // Set a height for the map
          width: "100%",
        }}
        center={selectedLocation}
        zoom={13}
      >
        <MarkerF
          position={selectedLocation}
          icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;