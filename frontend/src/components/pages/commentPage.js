// components/pages/commentPage.js
import React, { useState, useEffect } from 'react';
import CommentForm from '../commentForm';
import CommentList from '../commentList';
import axios from 'axios';

const CommentPage = () => {
  const [comments, setComments] = useState([]);

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
      <CommentForm onCommentPosted={handleCommentPosted} />
      <CommentList comments={comments} />
    </div>
  );
};

export default CommentPage;
