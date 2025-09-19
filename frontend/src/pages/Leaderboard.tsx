import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ILeaderboardEntry {
  _id: string;
  user: { username: string };
  snippet: { language: string; difficulty: string };
  wpm: number;
  accuracy: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<ILeaderboardEntry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/leaderboard');
        setLeaderboard(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch leaderboard');
      }
    };
    fetchLeaderboard();
  }, []);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Snippet</th>
            <th className="px-4 py-2">Speed (WPM)</th>
            <th className="px-4 py-2">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry._id} className="bg-gray-100">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{entry.user.username}</td>
              <td className="border px-4 py-2">{entry.snippet.language} ({entry.snippet.difficulty})</td>
              <td className="border px-4 py-2">{entry.wpm}</td>
              <td className="border px-4 py-2">{entry.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
