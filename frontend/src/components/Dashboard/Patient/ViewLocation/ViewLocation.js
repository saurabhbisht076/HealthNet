import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios"; // Ensure axios is installed
import styles from "./ViewLocation.module.css";

export default function ViewLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState(null);
  const [range, setRange] = useState(50); // Default range in km
  const [visibleHospitals, setVisibleHospitals] = useState([]);
  const [showNearest, setShowNearest] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [range]);

  // Fetch hospitals from backend
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hospitals'); // Adjust the endpoint if needed
        console.log("Fetched hospitals:", response.data);
        setVisibleHospitals(response.data); // Assuming the data is an array of hospital objects
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  // Update visible hospitals based on range
  useEffect(() => {
    if (userLocation && visibleHospitals.length) {
      const filteredHospitals = visibleHospitals.filter((hospital) => {
        const distance = haversineDistance(userLocation, hospital);
        return distance <= range * 1000; // Convert km to meters
      });

      console.log("Filtered hospitals within range:", filteredHospitals);
      setVisibleHospitals(filteredHospitals);
    }
  }, [userLocation, range, visibleHospitals]);

  // Calculate shortest path to the nearest hospital
  useEffect(() => {
    if (userLocation && showNearest && isLoaded) {
      if (visibleHospitals.length === 0) {
        setDirections(null); // Reset directions if no hospitals are in range
        return;
      }

      const closestHospital = findClosestHospital(userLocation, visibleHospitals);
      if (!closestHospital) return;

      console.log("Closest hospital:", closestHospital);

      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userLocation,
          destination: closestHospital,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log("Directions result:", result);
            setDirections(result);
          } else {
            console.error("Directions request failed due to:", status);
          }
        }
      );
    }
  }, [userLocation, showNearest, visibleHospitals, isLoaded]);

  // Utility: Haversine Distance Calculation
  function haversineDistance(coord1, coord2) {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  }

  // Find the closest hospital
  function findClosestHospital(userLocation, hospitals) {
    return hospitals.reduce(
      (closest, hospital) => {
        const distance = haversineDistance(userLocation, hospital);
        return distance < closest.distance
          ? { location: { lat: hospital.lat, lng: hospital.lng }, distance }
          : closest;
      },
      { location: null, distance: Infinity }
    ).location;
  }

  return (
    <div className={styles.container} >
      <header className={styles.navbar}>
        <h1>View Location</h1>
      </header>
      <div className={styles.controls}>
        <label>
          Range (km):{" "}
          <input
            type="number"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            min="1"
          />
        </label>
        <button onClick={() => setShowNearest(!showNearest)}>
          {showNearest ? "Show All Hospitals" : "Show Nearest Hospital"}
        </button>
      </div>
      <div className={styles.content}>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : !userLocation ? (
          <p>Fetching your location...</p>
        ) : (
          isLoaded && (
            <GoogleMap
              center={userLocation}
              zoom={12}
              mapContainerClassName={styles.mapContainer}
            >
              <Marker position={userLocation} label="You" />
              {!showNearest && visibleHospitals.length > 0 &&
                visibleHospitals.map((hospital, index) => (
                  <Marker
                    key={index}
                    position={{ lat: hospital.lat, lng: hospital.lng }}
                    label={hospital.name}
                  />
                ))}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          )
        )}
      </div>
    </div>
  );
}