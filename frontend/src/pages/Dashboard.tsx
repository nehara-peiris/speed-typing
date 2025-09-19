import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface IStats {
  avgSpeed: number;
  accuracy: number;
  snippetsCompleted: number;
}

interface IHistory {
  _id: string;
  snippet: { language: string; difficulty: string };
  wpm: number;
  accuracy: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<IStats | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this page.');
        return;
      }
      try {
        const res = await axios.get('http://localhost:8080/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.stats);
        setHistory(res.data.history);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Your Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-bold text-lg">Average Speed</h3>
          <p className="text-2xl">{stats.avgSpeed.toFixed(2)} WPM</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold text-lg">Average Accuracy</h3>
          <p className="text-2xl">{stats.accuracy.toFixed(2)}%</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-bold text-lg">Snippets Completed</h3>
          <p className="text-2xl">{stats.snippetsCompleted}</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Recent History</h3>
      <div className="flex flex-col gap-4">
        {history.map((item) => (
          <div key={item._id} className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{item.snippet.language} ({item.snippet.difficulty})</p>
                <p className="text-sm text-gray-600">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p>Speed: {item.wpm} WPM</p>
                <p>Accuracy: {item.accuracy}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
