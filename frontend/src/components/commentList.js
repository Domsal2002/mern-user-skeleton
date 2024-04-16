import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";

const CommentsList = ({ selectedLine }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch comments based on selected line
    const fetchComments = async () => {
      if (!selectedLine) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comment/getAll/${selectedLine}`);
        setComments(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [selectedLine]);

  const handleDeleteComment = async (_id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comment/deleteComment/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const updatedComments = comments.filter((comment) => comment._id !== _id);
        setComments(updatedComments);
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading comments</div>;
  }

  return (
    <div className="comments-container">
      <h2>Comments</h2>
  
      {selectedLine && (
        <div className="comments-list">
          {comments.map((comment) => (
            <Card key={comment._id} className="comment-card mx-1 my-2">
              <Card.Body>
                <Card.Title className="comment-title">Comment</Card.Title>
                <Card.Text className="comment-username">{comment.username}</Card.Text>
                <Card.Text className="comment-text">{comment.text}</Card.Text>
                <Card.Text className="comment-time">{new Date(comment.time).toLocaleString()}</Card.Text>
                
                <Button
                  className="delete-btn ms-2"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default CommentsList;

