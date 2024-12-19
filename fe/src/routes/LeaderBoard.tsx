import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Score {
  name: string;
  team: string;
  score: number;
}

const LeaderBoard = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [isUnfolded, setIsUnfolded] = useState(false); //เลื่อนสาร์น
  const [viewOption, setViewOption] = useState("All"); //set All ตอนเริ่ม

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

  const filteredScores =
    viewOption === "All"
      ? scores
      : scores.filter((score) => score.team === viewOption);

  const sortedTeams = Array.from(
    new Set(scores.map((score) => score.team))
  ).sort();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute top-8 right-8">
        <div
          style={{
            backgroundColor: "#212529",
            padding: "0.5rem",
            borderRadius: "0.25rem",
          }}
        >
          <div className="nes-select is-dark">
            <select
              required
              id="dark_select"
              value={viewOption}
              onChange={(e) => setViewOption(e.target.value)}
              style={{
                fontSize: "0.8rem",
                padding: "0.2rem",
                minWidth: "80px",
              }}
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

      <div className="flex flex-col w-[500px]">
        {/* Top Scroll */}
        <img
          src="/img/scroll.png"
          alt="Top of Royal Letter"
          className="w-full"
        />

        {/* Paper Content */}
        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: isUnfolded ? "400px" : 0,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="overflow-y-auto bg-scroll"
          style={{
            alignSelf: "center",
            backgroundImage: "url('/img/paper.png')",
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            width: "432px",
            maxHeight: "300px",
            borderTop: "2px solid transparent",
            borderBottom: "2px solid transparent",
          }}
        >
          {filteredScores.map((score: any) => (
            <div key={score.name} className="py-2 px-4 text-brown">
              <span className="font-bold">
                {score.name} - {score.team}
              </span>
              <span className="float-right">{score.score}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom Scroll */}
        <motion.img
          src="/img/scroll.png"
          alt="Bottom of Royal Letter"
          className="w-full"
          animate={{ y: isUnfolded ? filteredScores.length : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default LeaderBoard;
