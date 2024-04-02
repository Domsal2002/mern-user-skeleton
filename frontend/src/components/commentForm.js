import React, { useState, useRef } from 'react';
import axios from 'axios';

const CommentForm = () => {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameRef = useRef(null);
  const textRef = useRef(null);

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
      await axios.post('http://localhost:8081/comment/postComment', {
        username,
        text,
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
          <button type="submit" disabled={isSubmitting} onClick={refreshPage}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
