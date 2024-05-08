import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card';

const PRIMARY_COLOR = "#0";
const SECONDARY_COLOR = "#0";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`, data);
      navigate("/login"); // navigate to login page after successful registration
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  const containerStyle = {
    backgroundImage: `url('https://mbtagifts.com/cdn/shop/products/RTLMapwKeyBus48x48v.36Af-web.jpg?v=1668712403')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const cardStyle = {
    width: '30rem',
    marginBottom: '2rem',
    background: SECONDARY_COLOR // consistent background color
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: PRIMARY_COLOR }}>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={data.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: PRIMARY_COLOR }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter Email Please"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: PRIMARY_COLOR }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </Form.Group>
            {error && <div style={{ color: PRIMARY_COLOR, marginTop: '10px' }}>{error}</div>}
            <Button variant="primary" type="submit" style={{ background: PRIMARY_COLOR, border: 'none' }}>
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
