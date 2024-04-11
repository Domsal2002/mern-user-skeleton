import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [hoveredAdmin, setHoveredAdmin] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [selectedStationID, setSelectedStationID] = useState("All");
  const [stationIDs, setStationIDs] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [editedComments, setEditedComments] = useState([]);
  const [hoveredWordIndices, setHoveredWordIndices] = useState({});
  const navigate = useNavigate();

  const animalNoises = ["Woof", "Meow", "Quack", "Moo", "Neigh", "Oink", "Baa", "Cluck"];

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:8081/admin/getAllAdmins");
        if (response.ok) {
          const data = await response.json();
          setAdmins(data);
        } else {
          throw new Error("Failed to fetch admins");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdmins();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:8081/comment/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        const ids = Array.from(new Set(data.map((comment) => comment.lineID)));
        setStationIDs(ids);
        // Reset hovered word indices when comments are fetched
        setHoveredWordIndices({});
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleShowComments = () => {
    fetchComments();
    setShowComments(true);
  };

  const handleCloseComments = () => setShowComments(false);

  const handleStationSelect = (eventKey) => {
    setSelectedStationID(eventKey);
  };

  const handleDeleteAdmin = async (username) => {
    try {
      const response = await fetch(`http://localhost:8081/admin/deleteAdmin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      if (response.ok) {
        setAdmins(admins.filter(admin => admin.username !== username));
      } else {
        throw new Error("Failed to delete admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8081/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWordReplace = async (commentId, wordIndex) => {
    // Find the index of the comment in the comments array
    const commentIndex = comments.findIndex(comment => comment._id === commentId);
    if (commentIndex === -1) {
      console.error("Comment not found");
      return;
    }

    // Create a copy of the comments array
    const updatedComments = [...comments];
    // Split the comment text into words
    const words = updatedComments[commentIndex].text.split(" ");
    // Replace the selected word with an animal noise
    words[wordIndex] = animalNoises[Math.floor(Math.random() * animalNoises.length)];
    // Join the words back into a single string
    const newText = words.join(" ");
    
    // Send PUT request to update the comment on the server
    try {
      const response = await fetch(`http://localhost:8081/comment/editComment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newText })
      });
      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      // Update the state with the updated comment
      setComments(updatedComments.map((comment, index) => index === commentIndex ? { ...comment, text: newText } : comment));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredComments = selectedStationID === "All" ? comments : comments.filter((comment) => comment.lineID === selectedStationID);

  return (
    <div className="container">
      <div className="col-md-12 text-center">
        <h1>Admin Page</h1>
        <Button className="me-2" onClick={handleLogout}>Log Out</Button>
        <Button onClick={handleShowComments}>Manage Comments</Button>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <Card>
            <Card.Header>Admins:</Card.Header>
            <Card.Body>
              <ul>
                {admins.map((admin, index) => (
                  <li key={index} onMouseEnter={() => setHoveredAdmin(admin.username)} onMouseLeave={() => setHoveredAdmin(null)}>
                    {admin.username}
                    {hoveredAdmin === admin.username && (
                      <Button className="ms-2" variant="danger" size="sm" onClick={() => handleDeleteAdmin(admin.username)}>
                        Delete
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Modal show={showComments} onHide={handleCloseComments} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Comments Moderation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown onSelect={handleStationSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-station-id">
              Filter by Station ID
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              {stationIDs.map((id) => (
                <Dropdown.Item eventKey={id} key={id}>{id}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {filteredComments.map((comment, commentIndex) => (
            <Card key={commentIndex} className="mb-2">
              <Card.Body>
                <div style={{ marginBottom: "10px", fontWeight: "bold" }}>{comment.username}:</div>
                {comment.text.split(" ").map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    onClick={() => handleWordReplace(comment._id, wordIndex)}
                    onMouseEnter={() => setHoveredWordIndices({ commentIndex, wordIndex })}
                    onMouseLeave={() => setHoveredWordIndices({})}
                    style={{
                      cursor: "pointer",
                      marginRight: "5px",
                      backgroundColor: hoveredWordIndices.commentIndex === commentIndex && hoveredWordIndices.wordIndex === wordIndex ? "yellow" : "transparent"
                    }}
                  >
                    {word}{" "}
                  </span>
                ))}
                <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment._id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminPage;
