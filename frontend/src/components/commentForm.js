import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import getUserInfo from '../utilities/decodeJwt';

const CommentForm = ({ onSelectLine, onSelectStation }) => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  const textRef = useRef(null);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await axios.get('https://api-v3.mbta.com/routes?filter[type]=0,1');
        const linesData = response.data.data.map(line => ({
          id: line.id,
          name: line.attributes.long_name
        }));
        setLines(linesData);
      } catch (err) {
        console.error("Error fetching lines:", err);
      }
    };

    fetchLines();
  }, []);

  useEffect(() => {
    if (selectedLine) {
      const fetchStations = async () => {
        try {
          const response = await axios.get(`https://api-v3.mbta.com/stops?filter[route]=${selectedLine}`);
          const stationsData = response.data.data.map(station => ({
            id: station.id,
            name: station.attributes.name
          }));
          setStations(stationsData);
        } catch (err) {
          console.error("Error fetching stations:", err);
        }
      };

      fetchStations();
    } else {
      setStations([]); // Clear stations when line is not selected
    }
  }, [selectedLine]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text) {
      setErrors({ text: 'Comment is required' });
      textRef.current.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const userInfo = getUserInfo();
      const username = userInfo.username;

      await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comment/postComment/${selectedLine}`, {
        username,
        text,
        lineID: selectedLine,
        stationID: selectedStation,
      });

      alert('Comment submitted successfully');
      setText('');
      setErrors({});
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Error submitting comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Post a Comment</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="selectLine">Select Line:</label>
          <select
            id="selectLine"
            style={styles.formControl}
            onChange={(e) => {
              onSelectLine(e.target.value);
              setSelectedLine(e.target.value);
              setSelectedStation('');
            }}
            value={selectedLine}
          >
            <option value="">Select a Line</option>
            {lines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
        </div>

        {selectedLine && (
          <div style={styles.formGroup}>
            <label htmlFor="selectStation">Select Station:</label>
            <select
              id="selectStation"
              style={styles.formControl}
              onChange={(e) => {
                onSelectStation(e.target.value);
                setSelectedStation(e.target.value);
              }}
              value={selectedStation}
            >
              <option value="">Select a Station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.formGroup}>
          <label htmlFor="text">Comment:</label>
          <textarea
            id="text"
            style={styles.formControl}
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          {errors.text && <div style={styles.error}>{errors.text}</div>}
        </div>

        <div style={styles.formGroup}>
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  formGroup: {
    marginBottom: '15px'
  },
  formControl: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    fontSize: '14px'
  }
};

export default CommentForm;
