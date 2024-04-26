import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import myIcon from '../images/train.png'

const MBTAMap = ({ selectedLine, selectedStation, onSelectStation, lines, stops }) => {
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

  const customIcon = L.icon({
    iconUrl: myIcon, // URL to the icon image
    iconSize: [27, 30], // Size of the icon, default is [25, 41]
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });


  return (
    <MapContainer
      center={[42.3521, -71.0552]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      whenCreated={map => {
        mapRef.current = map;
        console.log("Map created and ref assigned");
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stops.map(station => (
        <Marker
          key={station.id}
          position={[station.attributes.latitude, station.attributes.longitude]}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              onSelectStation(station.id); // Use the onSelectStation prop when a marker is clicked
              if (mapRef.current) {
                mapRef.current.flyTo([station.attributes.latitude, station.attributes.longitude], 16);
              }
            }
          }}
        >
          <Popup>{station.attributes.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MBTAMap;
