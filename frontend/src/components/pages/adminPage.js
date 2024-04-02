import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [hoveredAdmin, setHoveredAdmin] = useState(null); // State to track hovered admin
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDeleteAdmin = async (username) => {
    try {
      const response = await fetch("http://localhost:8081/admin/deleteAdmin", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      if (response.ok) {
        // If deletion successful, fetch updated list of admins
        const updatedAdmins = admins.filter((admin) => admin.username !== username);
        setAdmins(updatedAdmins);
      } else {
        throw new Error("Failed to delete admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="col-md-12 text-center">
        <h1>Admin Page</h1>
        <Button className="me-2" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <Card>
            <Card.Header>Admins:</Card.Header>
            <Card.Body>
              <ul>
                {admins.map((admin, index) => (
                  <li
                    key={index}
                    onMouseEnter={() => setHoveredAdmin(admin.username)} // Set hovered admin
                    onMouseLeave={() => setHoveredAdmin(null)} // Reset hovered admin
                  >
                    {admin.username}
                    {hoveredAdmin === admin.username && ( // Display delete button only when hovered
                      <Button
                        className="ms-2"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.username)}
                      >
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
    </div>
  );
};

export default AdminPage;
