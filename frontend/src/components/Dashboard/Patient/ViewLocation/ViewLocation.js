import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import styles from "./ViewLocation.module.css";

const hospitalLocations = [
  { lat: 28.6139, lng: 77.2090, name: "AIIMS Delhi" },
  { lat: 28.6280, lng: 77.3649, name: "Apollo Hospital" },
  { lat: 28.5355, lng: 77.3910, name: "Fortis Hospital" },
  { lat: 28.6285, lng: 77.2069, name: "Max Super Specialty" },
  { lat: 28.6423, lng: 77.3445, name: "Safdarjung Hospital" },
  { lat: 28.6285, lng: 77.2069, name: "BLK Super Speciality" },
  { lat: 28.5832, lng: 77.2361, name: "Holy Family Hospital" }
];

const haversineDistance = (coord1, coord2) => {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
    Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function ViewLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState(null);
  const [range, setRange] = useState(50);
  const [visibleHospitals, setVisibleHospitals] = useState([]);
  const [showNearest, setShowNearest] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  const findClosestHospital = useCallback(
    (userLoc, hospitals) => hospitals.reduce(
      (closest, hospital) => {
        const distance = haversineDistance(userLoc, hospital);
        return distance < closest.distance ? { location: hospital, distance } : closest;
      },
      { location: null, distance: Infinity }
    ).location,
    []
  );

  useEffect(() => {
    let watchId;
    
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition( 
        ({ coords }) => setUserLocation({
          lat: coords.latitude,
          lng: coords.longitude
        }),
        (error) => console.error("Location error:", error),
        { 
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000 
        }
      );
    }
  
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId); 
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      const filtered = hospitalLocations.filter(hospital => 
        haversineDistance(userLocation, hospital) <= range
      );
      setVisibleHospitals(filtered.sort((a, b) => 
        haversineDistance(userLocation, a) - haversineDistance(userLocation, b)
      ));
    }
  }, [userLocation, range]);

  useEffect(() => {
    if (!userLocation || !showNearest || !isLoaded || visibleHospitals.length === 0) return;
  
    const calculateDirections = async () => {
      try {
        const closest = findClosestHospital(userLocation, visibleHospitals);
        
        if (!closest) {
          setDirections(null);
          return;
        }
  
        const directionsService = new window.google.maps.DirectionsService();
        const result = await directionsService.route({
          origin: userLocation,
          destination: closest,
          travelMode: window.google.maps.TravelMode.DRIVING
        });
  
        setDirections(result);
      } catch (error) {
        console.error("Directions error:", error);
        setDirections(null);
        setShowNearest(false); // Reset on error
      }
    };
  
    calculateDirections();
  }, [userLocation, showNearest, visibleHospitals, isLoaded, findClosestHospital]);

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1>Emergency Medical Facilities</h1>
      </header>
      
      <div className={styles.controls}>
        <div className={styles.rangeControl}>
          <label>Search Radius:</label>
          <input
            type="range"
            min="5"
            max="100"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
          />
          <span>{range} km</span>
        </div>
        <button
  className={`${styles.actionButton} ${showNearest ? styles.active : ""}`}
  onClick={() => {
    if (visibleHospitals.length > 0) {
      setShowNearest(!showNearest);
    }
  }}
  disabled={!visibleHospitals.length}
>
  {showNearest ? "Show All Facilities" : "Show Nearest Facility"}
</button>
      </div>

      <div className={styles.content}>
        {error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>⚠️ {error}</p>
            <p>Please enable location permissions to use this feature.</p>
          </div>
        ) : !userLocation ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Detecting your location...</p>
          </div>
        ) : isLoaded ? (
          <GoogleMap
            center={userLocation}
            zoom={12}
            mapContainerClassName={styles.mapContainer}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false
            }}
          >
            <Marker 
              position={userLocation}
              label="📍 You"
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF"
              }}
            />

            {!showNearest && visibleHospitals.map((hospital) => (
              <Marker
                key={`${hospital.lat}-${hospital.lng}`}
                position={{ lat: hospital.lat, lng: hospital.lng }}
                label={hospital.name}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />
            ))}

            {directions && (
              <DirectionsRenderer 
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 5
                  },
                  suppressMarkers: true
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <p className={styles.errorText}>Failed to load maps</p>
        )}
      </div>
    </div>
  );
}