import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
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
                  <li key={index}>{admin.username}</li>
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
