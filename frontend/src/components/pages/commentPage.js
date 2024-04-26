import React, { useState, useEffect } from 'react';
import CommentForm from '../commentForm';
import CommentsList from '../commentList';
import MBTAMap from './MBTAMap';
import 'leaflet/dist/leaflet.css';

const CommentPage = () => {
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [lines, setLines] = useState([]);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    fetch('https://api-v3.mbta.com/routes?filter[type]=0,1')
      .then(response => response.json())
      .then(data => setLines(data.data))
      .catch(error => console.error('Error fetching lines:', error));
  }, []);

  useEffect(() => {
    if (selectedLine) {
      fetch(`https://api-v3.mbta.com/stops?filter[route]=${selectedLine}`)
        .then(response => response.json())
        .then(data => setStops(data.data))
        .catch(error => console.error('Error fetching stops:', error));
    } else {
      setStops([]);
    }
  }, [selectedLine]);

  const onSelectLine = (lineId) => {
    setSelectedLine(lineId);
    setSelectedStation(null); // Reset station when line changes
  };

  const onSelectStation = (stationId) => {
    setSelectedStation(stationId);
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Comment Page</h1>
      <div style={styles.contentContainer}>
        <div style={styles.leftContainer}>
          <CommentForm
            onSelectLine={onSelectLine}
            onSelectStation={onSelectStation}
            lines={lines}
            stops={stops}
            selectedLine={selectedLine}
            selectedStation={selectedStation}
          />
          <CommentsList
            selectedLine={selectedLine}
            selectedStation={selectedStation}
          />
        </div>
        <div style={styles.mapContainer}>
          <MBTAMap
            selectedLine={selectedLine}
            selectedStation={selectedStation}
            lines={lines}
            stops={stops}
            onSelectStation={onSelectStation}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1.5, // Adjust flex as needed
    marginRight: '20px',
  },
  mapContainer: {
    flex: 2,  // Adjust the flex proportion to make the map bigger relative to the left container
    width: '60vw', // Uses 60% of the viewport width
    height: '80vh', // Uses 80% of the viewport height
    minWidth: '300px', // Ensures the map has a minimum readable size
    minHeight: '400px' // Ensures the map has a minimum readable size
  }
};

export default CommentPage;
