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
  const navigate = useNavigate();

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
        // Extract unique station IDs
        const ids = Array.from(new Set(data.map((comment) => comment.lineID)));
        setStationIDs(ids);
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
                      <Button className="ms-2" variant="danger" size="sm">
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
          {filteredComments.map((comment, index) => (
            <Card key={index} className="mb-2">
              <Card.Body>
                <Card.Text>{comment.text}</Card.Text>
                <Card.Text>Line ID: {comment.lineID}</Card.Text>
                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                <Button variant="danger" size="sm">
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

