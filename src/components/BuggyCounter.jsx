// src/components/BuggyCounter.jsx

import React, { useState } from 'react';

function BuggyCounter() {
  const [count, setCount] = useState(0);

  if (count === 5) {
    // Simulate a JS error
    throw new Error('I crashed!');
  }

  return (
    <div style={{ border: '1px solid green', padding: '10px' }}>
      <h3>Buggy Counter</h3>
      <p>This component will crash when the count hits 5.</p>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default BuggyCounter;