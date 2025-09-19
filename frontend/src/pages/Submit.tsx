import React, { useState } from 'react';
import axios from 'axios';

const Submit: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to submit a snippet.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/snippets',
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Snippet submitted successfully! It will be reviewed by an admin.');
      setCode('');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Failed to submit snippet');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Submit a Snippet</h2>
      {message && <p className="bg-blue-100 text-blue-800 p-2 mb-4 rounded">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Language</label>
          <select
            className="w-full p-2 border rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Code</label>
          <textarea
            className="w-full p-2 border rounded font-mono"
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Submit Snippet
        </button>
      </form>
    </div>
  );
};

export default Submit;
