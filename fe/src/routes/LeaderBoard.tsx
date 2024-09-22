import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';

const LeaderBoard = () => {
  const [scores, setScores] = useState([]);
  const [isUnfolded, setIsUnfolded] = useState(false); //เลื่อนสาร์น
  const [viewOption, setViewOption] = useState('All'); //set All ตอนเริ่ม

  useEffect(() => {
    const fetchScores = async () => {
      const response = await fetch("http://localhost:5000/api/scores");
      const data = await response.json();
      setScores(data.data);
    };
    fetchScores();
  }, []);

  useEffect(() => {
    const unfoldTimer = setTimeout(() => {
      setIsUnfolded(true);
    }, 200);

    return () => clearTimeout(unfoldTimer);
  }, []);

  const filteredScores = viewOption === 'All' 
    ? scores 
    : scores.filter(score => score.team === viewOption);

  const sortedTeams = Array.from(new Set(scores.map(score => score.team))).sort();

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      
      <div className="absolute top-8 right-8">
        <div style={{ backgroundColor: '#212529', padding: '0.5rem', borderRadius: '0.25rem' }}>
          <div className="nes-select is-dark">
            <select
              required
              id="dark_select"
              value={viewOption}
              onChange={(e) => setViewOption(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.2rem', minWidth: '80px' }}
            >
              <option value="All">All</option>
              {sortedTeams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="relative w-[500px]">
        <img src="/img/top.png" alt="Top of Royal Letter" className="w-full" />

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isUnfolded ? 'auto' : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="bg-[url('/img/middle.png')] bg-repeat-y w-full">
            {filteredScores.map((score: any) => (
              <div key={score.name} className="py-2 px-4 text-brown">
                <span className="font-bold">{score.name} - {score.team}</span>
                <span className="float-right">{score.score}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.img
          src="/img/button.png"
          alt="Button of Royal Letter"
          className="w-full"
          animate={{ y: isUnfolded ? scores.length * 0 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default LeaderBoard;
