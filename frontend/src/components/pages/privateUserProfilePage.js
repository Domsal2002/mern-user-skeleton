import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";



const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();


  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUsername(userInfo.username);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/profile/${userInfo.username}`);
      const userData = await response.json();
      setUsername(userData.username);
      setBio(userData.bio);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      fetchUserProfile();
    }

  }, []);


  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/profile/editProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, bio })
      });
      if (response.ok) {
        console.log("Profile updated successfully");
        handleClose();
        fetchUserProfile();
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <div><h4>Log in to view this page.</h4></div>;

  return (
    <div className="container">
      <div className="col-md-12 text-center">
       <h1>{user.username}</h1>
        <div className="col-md-12 text-center">
          <>
            <Button className="me-2" onClick={handleShow}>
              Edit Profile
            </Button>
            <Button onClick={handleLogout}>
              Log Out
            </Button>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username} readOnly
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    id="bio"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleUpdateProfile}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserProfile;