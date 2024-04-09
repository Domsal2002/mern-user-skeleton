import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';

const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Fetch lines from MBTA API
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

  useEffect(() => {
    // Fetch comments based on selected line
    const fetchComments = async () => {
      if (!selectedLine) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8081/comment/getByLine/${selectedLine}`);
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
      const response = await fetch(`http://localhost:8081/comment/deleteComment/${_id}`, {
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
    <div>
      <h2>Comments</h2>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Select Line
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {lines.map((line) => (
            <Dropdown.Item key={line.id} onClick={() => setSelectedLine(line.id)}>
              {line.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {selectedLine && (
        <div className="comments-list">
          {comments.map((comment) => (
            <Card key={comment._id} body outline color="blue" className="mx-1 my-2" bg="danger" style={{ width: "30rem" }}>
              <Card.Body>
                <Card.Title>Comment</Card.Title>
                <Card.Text>{comment.username}</Card.Text>
                <Card.Text>{comment.text}</Card.Text>
                <Card.Text>{new Date(comment.time).toLocaleString()}</Card.Text>
                <Button
                  className="ms-2"
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

