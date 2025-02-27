import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import styles from "./ViewLocation.module.css";

export default function ViewLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState(null);
  const [range, setRange] = useState(50); // Default range in km
  const [hospitals, setHospitals] = useState([]);
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
  }, []);

  // Fetch hospitals from backend
  useEffect(() => {
    if (!userLocation) return;

    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hospitals", {
          params: {
            lat: userLocation.lat,
            lng: userLocation.lng,
            range: range,
          },
        });

        console.log("Fetched hospitals:", response.data);
        setHospitals(response.data); // Hospitals are already filtered by backend
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, [userLocation, range]);

  // Find and show shortest path to nearest hospital
  useEffect(() => {
    if (!userLocation || !showNearest || !isLoaded) return;

    // If range is 0, reset everything
    if (range <= 0) {
      setDirections(null);
      return;
    }

    // Filter hospitals within range
    const hospitalsInRange = hospitals.filter(
      (hospital) => haversineDistance(userLocation, hospital) <= range
    );

    // If no hospitals are in range, reset directions and return
    if (hospitalsInRange.length === 0) {
      setDirections(null);
      return;
    }

    const closestHospital = findClosestHospital(userLocation, hospitalsInRange);
    if (!closestHospital) {
      setDirections(null);
      return;
    }

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
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
        }
      }
    );
  }, [userLocation, showNearest, hospitals, range, isLoaded]);

  // Utility: Haversine Distance Calculation
  function haversineDistance(coord1, hospital) {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const lat2 = hospital.location.coordinates[1];
    const lng2 = hospital.location.coordinates[0];

    const dLat = toRad(lat2 - coord1.lat);
    const dLng = toRad(lng2 - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // Find the closest hospital
  function findClosestHospital(userLocation, hospitals) {
    return hospitals.reduce(
      (closest, hospital) => {
        const distance = haversineDistance(userLocation, hospital);
        return distance < closest.distance
          ? { location: { lat: hospital.location.coordinates[1], lng: hospital.location.coordinates[0] }, distance }
          : closest;
      },
      { location: null, distance: Infinity }
    ).location;
  }

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1>View Location</h1>
      </header>
      <div className={styles.controls}>
        <label>
          Range (km):{" "}
          <input
            type="number"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            min="0"
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
              {!showNearest &&
                hospitals.map((hospital, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: hospital.location.coordinates[1],
                      lng: hospital.location.coordinates[0],
                    }}
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