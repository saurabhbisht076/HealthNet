import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import styles from "./ViewLocation.module.css";

const hospitalLocations = [
  { lat: 29.2075, lng: 79.5080, name: "Susheela Tiwari Government Hospital" },
  { lat: 29.2225, lng: 79.5167, name: "Krishna Hospital and Research Centre" },
  { lat: 29.2296, lng: 79.5053, name: "Vivekanand Hospital" },
  { lat: 29.2284, lng: 79.4986, name: "Brij Lal Hospital" },
  { lat: 29.2136, lng: 79.5068, name: "Neelkanth Hospital" },
  { lat: 29.2131, lng: 79.5092, name: "Central Hospital" },
  { lat: 29.2122, lng: 79.5059, name: "Bombay Hospital and Research Centre" },
  { lat: 28.5850, lng: 77.2080, name: "Aims Hospital" },
  { lat: 29.2267, lng: 79.5083, name: "Sai Hospital" },
  { lat: 29.2275, lng: 79.5032, name: "Tewari Maternity Center and Nursing Home" },
  { lat: 29.2189, lng: 79.5011, name: "Agarwal Clinic and Nursing Home" },
  { lat: 29.2187, lng: 79.5142, name: "Eye Q Super Speciality Eye Hospital" },
  { lat: 29.2244, lng: 79.5051, name: "Sanjiwani Hospital" },
  { lat: 29.2226, lng: 79.5100, name: "Saraswati Hospital" },
  { lat: 29.2279, lng: 79.5097, name: "Ram Hospital" },
  { lat: 29.2210, lng: 79.5078, name: "Mittal Nursing Home" },
  { lat: 29.2255, lng: 79.5065, name: "Mattrix Hospital" },
  { lat: 29.2281, lng: 79.5014, name: "Shriram Hospital" },
  { lat: 29.2248, lng: 79.5029, name: "Dr. Pooja Hospital" },
  { lat: 29.2291, lng: 79.5089, name: "Jeevan Jyoti Hospital" },
  { lat: 29.2266, lng: 79.5071, name: "Himalayan Eye Hospital" },
  { lat: 29.2214, lng: 79.5042, name: "Vinayak Hospital" },
  { lat: 29.2233, lng: 79.5069, name: "Mahesh Hospital" },
  { lat: 29.2287, lng: 79.5056, name: "Arun Hospital" },
  { lat: 29.2209, lng: 79.5103, name: "Bhatt Hospital" }
];

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
  }, []);

  // Update visible hospitals based on range
  useEffect(() => {
    if (userLocation) {
      const filteredHospitals = hospitalLocations.filter((hospital) => {
        const distance = haversineDistance(userLocation, hospital);
        return distance <= range;
      });

      // Set visibleHospitals to the filtered list of hospitals within range
      setVisibleHospitals(filteredHospitals);
    }
  }, [userLocation, range]);

  // Calculate shortest path to the nearest hospital
  useEffect(() => {
    if (userLocation && showNearest && isLoaded) {
      // If there are no visible hospitals in range, don't show the nearest hospital route
      if (visibleHospitals.length === 0) {
        setDirections(null);  // Reset directions if no hospitals are in range
        return;
      }

      const closestHospital = findClosestHospital(userLocation, visibleHospitals);
      if (!closestHospital) return;

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
            console.error("Directions request failed due to:", status);
          }
        }
      );
    }
  }, [userLocation, showNearest, visibleHospitals, isLoaded, findClosestHospital]);

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
    return R * c;
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