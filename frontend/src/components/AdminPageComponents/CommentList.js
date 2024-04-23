import React from 'react';
import { Button, Card } from 'react-bootstrap';
import FilterDropdown from './FilterDropdown';

const CommentList = ({
    comments, stationIDs, onReplaceWord, onDeleteComment,
    onSelect, selectedStationID, hoveredWordIndices, onMouseEnterWord, onMouseLeaveWord, onUpdateWordReplace
}) => {

    const handleWordReplace = async (commentId, wordIndex) => {
        await onReplaceWord(commentId, wordIndex);
        onUpdateWordReplace(); // Notify parent component about the word replacement
    };

    return (
        <Card>
            <Card.Header>
                <h5>Comment Management</h5>
            </Card.Header>
            <Card.Body>
                <FilterDropdown stationIDs={stationIDs} onSelect={onSelect} />
                <div className="text-center mb-3" style={{ fontWeight: 'bold' }}>
                    Showing comments for: {selectedStationID === "All" ? "All Stations" : `Station ID: ${selectedStationID}`}
                </div>
                {comments.map((comment, commentIndex) => (
                    <Card key={commentIndex} className="mb-2">
                        <Card.Body>
                            <strong>{comment.username}:</strong>
                            <div>
                                {comment.text.split(" ").map((word, wordIndex) => (
                                    <span key={wordIndex}
                                        onClick={() => handleWordReplace(comment._id, wordIndex)}
                                        onMouseEnter={() => onMouseEnterWord(commentIndex, wordIndex)}
                                        onMouseLeave={onMouseLeaveWord}
                                        style={{
                                            cursor: "pointer",
                                            marginRight: "5px",
                                            backgroundColor: hoveredWordIndices.commentIndex === commentIndex && hoveredWordIndices.wordIndex === wordIndex ? "yellow" : "transparent"
                                        }}>
                                        {word}{" "}
                                    </span>
                                ))}
                            </div>
                            <Button variant="danger" size="sm" onClick={() => onDeleteComment(comment._id)}>
                                Delete
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </Card.Body>
        </Card>
    );
};

export default CommentList;
