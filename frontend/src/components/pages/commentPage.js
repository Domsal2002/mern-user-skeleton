import React, { useState, useEffect } from 'react';
import CommentForm from '../commentForm';
import CommentsList from '../commentList';
import MBTAMap from './MBTAMap';
import 'leaflet/dist/leaflet.css';

const CommentPage = () => {
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
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
        <div style={styles.formContainer}>
          <CommentForm
            onSelectLine={onSelectLine}
            onSelectStation={onSelectStation}
            lines={lines}
            stops={stops}
            selectedLine={selectedLine}
            selectedStation={selectedStation}
          />
          {selectedLine && <CommentsList selectedLine={selectedLine} />}
        </div>
        <div style={styles.mapContainer}>
          <MBTAMap
            selectedLine={selectedLine}
            selectedStation={selectedStation}
            lines={lines}
            stops={stops}
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
