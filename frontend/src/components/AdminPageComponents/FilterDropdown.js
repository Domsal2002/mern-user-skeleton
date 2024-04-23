import React from 'react';
import { Dropdown } from 'react-bootstrap';

const FilterDropdown = ({ stationIDs, onSelect }) => {
    return (
        <Dropdown onSelect={onSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-station-id">
                Filter by Station ID
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                {stationIDs.map(id => (
                    <Dropdown.Item eventKey={id} key={id}>{id}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default FilterDropdown;
