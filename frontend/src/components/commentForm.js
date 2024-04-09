import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CommentForm = ({ selectedLine, onSelectLine }) => {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lines, setLines] = useState([]);

  const usernameRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await axios.get('https://api-v3.mbta.com/lines');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setErrors({ username: 'Username is required' });
      usernameRef.current.focus();
      return;
    }

    if (!text) {
      setErrors({ text: 'Comment is required' });
      textRef.current.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`http://localhost:8081/comment/postComment/${selectedLine}`, {
        username,
        text,
        lineID: selectedLine,
      });
      alert('Comment submitted successfully');
      setUsername('');
      setText('');
      setErrors({});
    } catch (error) {
      alert('Error submitting comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  function refreshPage() {
    window.location.reload();
  };

  return (
    <div>
      <h2>Post a Comment</h2>
      <label htmlFor="selectLine">Select Line:</label>
      <select
        id="selectLine"
        onChange={(e) => onSelectLine(e.target.value)}
        value={selectedLine}
      >
        <option value="">Select a Line</option>
        {lines.map((line) => (
          <option key={line.id} value={line.id}>
            {line.name}
          </option>
        ))}
      </select>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            ref={usernameRef}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div>
          <label htmlFor="text">Comment:</label>
          <textarea
            id="text"
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          {errors.text && <div className="error">{errors.text}</div>}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;

