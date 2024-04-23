import React, { useState, useEffect } from 'react';
import CommentForm from '../commentForm';
import CommentsList from '../commentList';
import MBTAMap from './MBTAMap';
import 'leaflet/dist/leaflet.css';

const CommentPage = () => {
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);  // New state for the selected station
  const [lines, setLines] = useState([]);
  const [stops, setStops] = useState([]);

  // Fetch all lines on component mount
  useEffect(() => {
    fetch('https://api-v3.mbta.com/routes?filter[type]=0,1') // Adjust types for subway lines, etc.
      .then(response => response.json())
      .then(data => setLines(data.data))
      .catch(error => console.error('Error fetching lines:', error));
  }, []);

  // Fetch stops when a line is selected
  useEffect(() => {
    if (selectedLine) {
      fetch(`https://api-v3.mbta.com/stops?filter[route]=${selectedLine}`)
        .then(response => response.json())
        .then(data => setStops(data.data))
        .catch(error => console.error('Error fetching stops:', error));
    } else {
      setStops([]);  // Clear stops if no line is selected
    }
  }, [selectedLine]);

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Comment Page</h1>
      <div style={styles.contentContainer}>
        <div style={styles.formContainer}>
          <CommentForm
            selectedLine={selectedLine}
            onSelectLine={setSelectedLine}
            onSelectStation={setSelectedStation}  // Passing down the handler
            lines={lines}
            stops={stops}
            selectedStation={selectedStation}  // Pass selectedStation to the form
          />
          {selectedLine && <CommentsList selectedLine={selectedLine} />}
        </div>
        <div style={styles.mapContainer}>
          <MBTAMap />
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
  formContainer: {
    flex: 1,
    marginRight: '20px',
  },
  mapContainer: {
    flex: 1,
    height: '600px',
  }
};

export default CommentPage;
