import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isEncoding, setIsEncoding] = useState(false);
  const eventSource = useRef(null);

  const startEncoding = () => {
    if (input) {
      setResult('');
      setIsEncoding(true);
      eventSource.current = new EventSource(`http://localhost:8080/encode?input=${encodeURIComponent(input)}`);

      eventSource.current.onmessage = (event) => {
        setResult(prev => prev + event.data);
      };

      eventSource.current.onerror = (event) => {
        console.log('EventSource failed:', event);
        eventSource.current.close();
        setIsEncoding(false);
      };
    }
  };

  const cancelEncoding = () => {
    if (eventSource.current) {
      eventSource.current.close();
      setIsEncoding(false);
    }
    fetch('http://localhost:8080/cancel', { method: 'POST' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
      <div className="App">
        <header className="App-header">
          <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter text to encode"
              disabled={isEncoding}
          />
          <button onClick={startEncoding} disabled={isEncoding}>
            Convert
          </button>
          <button onClick={cancelEncoding} disabled={!isEncoding}>
            Cancel
          </button>
          <textarea value={result} readOnly rows="10" cols="50"></textarea>
        </header>
      </div>
  );
}

export default App;