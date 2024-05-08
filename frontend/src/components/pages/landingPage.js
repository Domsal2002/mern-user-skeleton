import React from 'react';
import Card from 'react-bootstrap/Card';

const Landingpage = () => {
    const containerStyle = {
        backgroundImage: `url('https://mbtagifts.com/cdn/shop/products/RTLMapwKeyBus48x48v.36Af-web.jpg?v=1668712403')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative' // Needed to position the overlay absolutely
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent black color
    };

    const cardStyle = {
        width: '30rem',
        marginBottom: '2rem' // Added margin bottom for spacing
    };

    return (
        <div style={containerStyle}>
            <div style={overlayStyle}></div> {/* Overlay */}
            <Card style={cardStyle} className="mx-auto">
                <Card.Body>
                    <Card.Title>Welcome to Commute Connect</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">An app where users can chat and see others' chats about the MBTA</Card.Subtitle>
                    <Card.Text>
                        {/* You can add more text here if needed */}
                    </Card.Text>
                    <Card.Link href="/signup">Sign Up</Card.Link>
                    <Card.Link href="/login">Login</Card.Link>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Landingpage;
