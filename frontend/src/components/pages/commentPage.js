import React, { useState } from 'react';
import CommentForm from '../commentForm';
import CommentsList from '../commentList';

const CommentPage = () => {
  const [selectedLine, setSelectedLine] = useState(null);  // Add selectedLine state

  return (
    <div>
      <h1>Comment Page</h1>
      <CommentForm
        selectedLine={selectedLine}
        onSelectLine={(line) => setSelectedLine(line)}  // Pass onSelectLine prop
      />
      <CommentsList selectedLine={selectedLine} />  {/* Pass selectedLine as prop */}
    </div>
  );
};

export default CommentPage;

