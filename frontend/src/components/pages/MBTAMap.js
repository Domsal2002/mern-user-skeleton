import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MBTAMap = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch('https://api-v3.mbta.com/stops?filter[route_type]=1') // Adjust API call as needed
      .then(response => response.json())
      .then(data => setStations(data.data))
      .catch(error => console.error('Error fetching MBTA stations:', error));
  }, []);

  return (
    <MapContainer center={[42.3521, -71.0552]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stations.map(station => (
        <Marker key={station.id} position={[station.attributes.latitude, station.attributes.longitude]}>
          <Popup>{station.attributes.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MBTAMap;
