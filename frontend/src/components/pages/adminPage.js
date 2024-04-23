import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminList from './../AdminPageComponents/AdminList';
import CommentList from './../AdminPageComponents/CommentList';

const AdminPage = () => {
    const [admins, setAdmins] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedStationID, setSelectedStationID] = useState('All');
    const [stationIDs, setStationIDs] = useState([]);
    const [hoveredWordIndices, setHoveredWordIndices] = useState({});
    const navigate = useNavigate();

    const animalNoises = ["Woof", "Meow", "Quack", "Moo", "Neigh", "Oink", "Baa", "Cluck"];

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch admins
                const adminResponse = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/admin/getAllAdmins`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (adminResponse.ok) {
                    const adminData = await adminResponse.json();
                    setAdmins(adminData);
                } else {
                    throw new Error('Failed to fetch admins');
                }
    
                // Fetch comments
                const commentResponse = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comment/getAll`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (commentResponse.ok) {
                    const commentData = await commentResponse.json();
                    setComments(commentData);
                    setStationIDs([...new Set(commentData.map(comment => comment.lineID))]);
                } else {
                    throw new Error('Failed to fetch comments');
                }
            } catch (error) {
                console.error('Fetching data error:', error);
            }
        }
        fetchData();
    }, []);
    
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleDeleteAdmin = async (username) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/admin/deleteAdmin`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            setAdmins(prevAdmins => prevAdmins.filter(admin => admin.username !== username));
        } catch (error) {
            console.error(error);
        }
    };

    const handleStationSelect = (eventKey) => {
        setSelectedStationID(eventKey);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comment/deleteComment/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleWordReplace = async (commentId, wordIndex) => {
        const commentIndex = comments.findIndex(comment => comment._id === commentId);
        if (commentIndex === -1) {
            console.error("Comment not found");
            return;
        }
        const updatedComments = [...comments];
        const words = updatedComments[commentIndex].text.split(" ");
        words[wordIndex] = animalNoises[Math.floor(Math.random() * animalNoises.length)];
        const newText = words.join(" ");

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comment/editComment/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            });
            if (!response.ok) {
                throw new Error("Failed to update comment");
            }
            updatedComments[commentIndex] = { ...updatedComments[commentIndex], text: newText };
            setComments(updatedComments);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateWordReplace = () => {
        // This function can be empty since we're using state to track comments
        // If the state updates, it will automatically trigger a re-render
    };

    const handleMouseEnter = (commentIndex, wordIndex) => {
        setHoveredWordIndices({ commentIndex, wordIndex });
    };

    const handleMouseLeave = () => {
        setHoveredWordIndices({});
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-center my-4">Admin Panel</h1>
                    <div className="mb-4"> {/* Added margin here */}
                        <AdminList admins={admins} onDeleteAdmin={handleDeleteAdmin} />
                    </div>
                    <CommentList 
                        comments={comments.filter(comment => selectedStationID === "All" || comment.lineID === selectedStationID)}
                        stationIDs={stationIDs}
                        selectedStationID={selectedStationID}
                        onReplaceWord={handleWordReplace} 
                        onDeleteComment={handleDeleteComment}
                        onSelect={handleStationSelect}
                        hoveredWordIndices={hoveredWordIndices}
                        onMouseEnterWord={handleMouseEnter}
                        onMouseLeaveWord={handleMouseLeave}
                        onUpdateWordReplace={handleUpdateWordReplace}
                    />
                    <Button className="mt-4" onClick={handleLogout}>Log Out</Button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
