import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MBTAMap = ({ selectedLine, selectedStation, lines, stops }) => {
  const mapRef = useRef(null);

  // Function to fetch geometry for the selected line
  const fetchLineGeometry = async (lineId) => {
    try {
      const response = await fetch(`https://api-v3.mbta.com/routes/${lineId}?include=geometry`);
      const data = await response.json();
      return data.data.attributes.geometry;
    } catch (error) {
      console.error('Error fetching line geometry:', error);
      return null;
    }
  };

  // Highlight the selected line
  useEffect(() => {
    if (selectedLine && mapRef.current) {
      fetchLineGeometry(selectedLine).then(geometry => {
        if (geometry && mapRef.current) {
          const geoJsonLayer = L.geoJSON(geometry, {
            color: 'blue',
            weight: 5
          }).addTo(mapRef.current);
          mapRef.current.fitBounds(geoJsonLayer.getBounds());
        }
      });
    }
  }, [selectedLine]);

  // Zoom in on the selected station
  useEffect(() => {
    if (selectedStation && stops.length > 0 && mapRef.current) {
      const station = stops.find(station => station.id === selectedStation);
      if (station) {
        console.log("Zooming to station:", station); // Debug log
        mapRef.current.flyTo([station.attributes.latitude, station.attributes.longitude], 16);
      } else {
        console.log("Station not found for ID:", selectedStation); // Debug log if station is not found
      }
    }
  }, [selectedStation, stops]);

  return (
    <MapContainer
      center={[42.3521, -71.0552]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      whenCreated={map => {
        mapRef.current = map;
        console.log("Map initialized"); // Debug log to confirm map initialization
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stops.map(station => (
        <Marker key={station.id} position={[station.attributes.latitude, station.attributes.longitude]}>
          <Popup>{station.attributes.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MBTAMap;
