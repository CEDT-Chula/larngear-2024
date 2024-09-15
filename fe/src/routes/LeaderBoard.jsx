import React, { useState, useEffect } from "react";

const LeaderBoard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const response = await fetch("/api/scores");
      const data = await response.json();
      setScores(data.data);
    };

    fetchScores();
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 mt-[80px]">
      <h1 className="nes-text is-primary text-center my-5">Leaderboard</h1>
      <ul>
        {scores.map((score) => (
          <li key={score.name}>
            {score.name} - {score.score}
          </li>
        ))}
      </ul>
    </div>


  );
};

export default LeaderBoard;