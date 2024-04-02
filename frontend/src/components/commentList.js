import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";


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

  const handleDeleteComment = async (_id) => {
    try {
      const response = await fetch(`http://localhost:8081/comment/deleteComment/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // If deletion successful, fetch updated list of comments
        const updatedComments = comments.filter((comment) => comment._id !== _id);
        setComments(updatedComments);
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <div className="comments-list">
        {comments.map((comment) => (
          <Card body outline color="blue" className="mx-1 my-2" bg="danger" style={{ width: "30rem" }}>
            <Card.Body>
              <Card.Title>Comment</Card.Title>
              <Card.Text>{comment.username}</Card.Text>
              <Card.Text>{comment.text}</Card.Text>
              <Card.Text>{new Date(comment.time).toLocaleString()}</Card.Text>
              <Button
                className="ms-2"
                variant="danger"
                size="sm"
                onClick={() => handleDeleteComment(comment._id)} // Pass comment.id to handleDeleteComment
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
