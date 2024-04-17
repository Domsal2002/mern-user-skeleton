import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import getUserInfo from '../utilities/decodeJwt';

const CommentsList = ({ selectedLine }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = getUserInfo();

  useEffect(() => {
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
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comment/deleteComment/${_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const updatedComments = comments.filter(comment => comment._id !== _id);
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
    <div style={styles.container}>
      <h2>Comments</h2>
      <div style={styles.commentsList}>
        {comments.map((comment) => (
          <Card key={comment._id} style={styles.card}>
            <Card.Body>
              <Card.Title style={styles.username}>{comment.username}</Card.Title>
              <Card.Text style={styles.commentText}>{comment.text}</Card.Text>
              <Card.Text style={styles.commentTime}>{new Date(comment.time).toLocaleString()}</Card.Text>
              {currentUser && currentUser.username === comment.username && (
                <Button
                  style={styles.deleteButton}
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Delete
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    padding: '20px',
    margin: '20px 0',
    fontFamily: 'Arial, sans-serif',
    float: 'left'  // Align the container to the left
  },
  commentsList: {
    marginTop: '10px'
  },
  card: {
    marginBottom: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  username: {
    fontWeight: 'bold'
  },
  commentText: {
    color: '#333'
  },
  commentTime: {
    fontSize: '0.85em',
    color: '#666'
  },
  deleteButton: {
    float: 'right'
  }
};

export default CommentsList;