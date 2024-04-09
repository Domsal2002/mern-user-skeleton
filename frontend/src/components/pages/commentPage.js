import React, { useState, useEffect } from 'react';
import CommentForm from '../commentForm';
import CommentsList from '../commentList';
import axios from 'axios';

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);  // Add selectedStop state

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost:8081/comment/getAll");
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  const handleCommentPosted = (newComment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div>
      <h1>Comment Page</h1>
      <CommentForm selectedStop={selectedStop} />  {/* Pass selectedStop as prop */}
      <CommentsList
        comments={comments}
        selectedStop={selectedStop}  // Pass selectedStop as prop
        onSelectStop={(stopID) => setSelectedStop(stopID)}  // Update selectedStop
      />
    </div>
  );
};

export default CommentPage;
