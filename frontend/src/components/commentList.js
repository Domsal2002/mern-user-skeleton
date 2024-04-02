import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:8081/comment/getAll');
        setComments(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading comments</div>;
  }

  return (
    <div>
      <h2>Comments</h2>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <h3>{comment.username}</h3>
            <p>{comment.text}</p>
            <p>{new Date(comment.time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
