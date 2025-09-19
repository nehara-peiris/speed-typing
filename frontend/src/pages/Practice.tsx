import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Practice: React.FC = () => {
  const [snippet, setSnippet] = useState({ _id: '', code: '' });
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSnippet();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fetchSnippet = async () => {
    const res = await axios.get('http://localhost:8080/api/snippets/random');
    setSnippet(res.data);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (snippet.code.startsWith(value)) {
      setUserInput(value);
    }

    if (value === snippet.code) {
      const endTime = Date.now();
      const timeTaken = (endTime - (startTime || endTime)) / 1000; // in seconds
      const words = snippet.code.split(' ').length;
      const calculatedWpm = Math.round((words / timeTaken) * 60);
      setWpm(calculatedWpm);
      // For simplicity, accuracy is 100% since we force correctness
      setAccuracy(100);
      saveResult(timeTaken, calculatedWpm, 100);
    }
  };

  const saveResult = async (time: number, wpm: number, accuracy: number) => {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post('http://localhost:8080/api/results',
        { snippet: snippet._id, time, wpm, accuracy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  const renderSnippet = () => {
    return snippet.code.split('').map((char, index) => {
      let color = 'text-gray-500';
      if (index < userInput.length) {
        color = char === userInput[index] ? 'text-green-500' : 'text-red-500';
      }
      return <span key={index} className={color}>{char}</span>;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Practice Mode</h2>
      <div className="bg-gray-100 p-4 rounded mb-4 font-mono text-lg">
        {renderSnippet()}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full p-2 border rounded"
        value={userInput}
        onChange={handleInputChange}
        autoFocus
      />
      {wpm > 0 && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="text-xl font-bold">Snippet Completed!</h3>
          <p>Time: {((snippet.code.length / 5) / wpm) * 60}s</p>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <button onClick={fetchSnippet} className="mt-2 bg-blue-500 text-white p-2 rounded">
            Next Snippet
          </button>
        </div>
      )}
    </div>
  );
};

export default Practice;
