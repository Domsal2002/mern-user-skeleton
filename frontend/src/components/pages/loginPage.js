import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card';
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#0";
const SECONDARY_COLOR = '#0';

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [data, setData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [light, setLight] = useState(false);
    const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
    const [bgText, setBgText] = useState('Light Mode');

    useEffect(() => {
        const obj = getUserInfo(localStorage.getItem("accessToken"));
        setUser(obj);

        if (light) {
            setBgColor("white");
            setBgText('Dark mode')
        } else {
            setBgColor(SECONDARY_COLOR);
            setBgText('Light mode')
        }
    }, [light, user]);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: res } = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`, data);
            localStorage.setItem("accessToken", res.accessToken);
            navigate("/home");
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
        background: bgColor
    };

    if (user) {
        navigate('/home');
        return null;
    }

    return (
        <div style={containerStyle}>
            <Card style={cardStyle}>
                <Card.Body>
                    <Form>
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
                        <Button variant="primary" type="submit" onClick={handleSubmit} style={{ background: PRIMARY_COLOR, border: 'none' }}>
                            Log In
                        </Button>
                        <Link to="/signup" style={{ color: PRIMARY_COLOR, display: 'block', marginTop: '15px' }}>Don't have an account? Sign up</Link>
                        {error && <div style={{ color: PRIMARY_COLOR, marginTop: '10px' }}>{error}</div>}
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;
