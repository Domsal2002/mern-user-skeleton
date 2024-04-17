import React, { useState } from 'react';
import CommentForm from '../commentForm';
import CommentsList from '../commentList';

const CommentPage = () => {
  const [selectedLine, setSelectedLine] = useState(null);

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Comment Page</h1>
      <CommentForm
        selectedLine={selectedLine}
        onSelectLine={(line) => setSelectedLine(line)}
      />
      {selectedLine && <CommentsList selectedLine={selectedLine} />}
    </div>
  );
};

const styles = {
  pageContainer: {
    maxWidth: '800px',
    margin: '20px 0',
    padding: '20px 20px 20px 40px',  // Adds more padding to the left
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left'  // Ensures that text alignment is consistently to the left
  },
  header: {
    textAlign: 'left',  // Aligns the header text to the left
    color: '#333',
    marginBottom: '20px'  // Adds a bit more space below the header
  }
};

export default CommentPage;