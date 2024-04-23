import React from 'react';
import { Button, Card } from 'react-bootstrap';

const AdminList = ({ admins, onDeleteAdmin }) => {
    return (
        <Card>
            <Card.Header>Admin Management</Card.Header>
            <Card.Body>
                <ul>
                    {admins.map((admin, index) => (
                        <li key={index}>
                            {admin.username}
                            <Button className="ms-2" variant="danger" size="sm" onClick={() => onDeleteAdmin(admin.username)}>
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
};

export default AdminList;
