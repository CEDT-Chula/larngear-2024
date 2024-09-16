import React, { useState, useEffect } from "react";
import getScores from "../libs/getScores";

const LeaderBoard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await getScores();
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

     fetchScores();
  }, []);

  return (
    <div className="nes-container is-rounded is-dark mt-[80px]">
      <h1 className="nes-container is-rounded is-dark is-centered">Leaderboard</h1>
      <ul>
        {scores.data?.map((score, index) => (
          <li key={index} className="nes-container is-rounded is-dark">
            <strong>{score.name}</strong> - {score.team}: {score.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
