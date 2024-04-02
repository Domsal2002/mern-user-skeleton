import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function ProfilePage() {
  const [profiles, setProfiles] = useState([]);


  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost:8081/profile/getAll',
      );
      setProfiles(result.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Profiles</h1>
      {profiles.map(profile => (
        <Card body outline color="success" className="mx-1 my-2" bg="danger" style={{ width: "30rem" }}
      >
        <Card.Body>
        <Card.Title>profile</Card.Title>
        <Card.Text>{profile.username}{profile.bio}</Card.Text>
        </Card.Body>
      </Card>
      ))}

    </div>
  );
}

export default ProfilePage;
