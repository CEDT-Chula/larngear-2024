import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Score {
  name: string;
  team: string;
  score: number;
  rank?: number; // Add rank property
}

const LeaderBoard = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [viewOption, setViewOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchScores = async () => {
      const response = await fetch("http://localhost:5000/api/scores");
      const data = await response.json();
      const rankedScores = data.data.map((score: Score, index: number) => ({
        ...score,
        rank: index + 1, // Assign rank based on the original order
      }));
      setScores(rankedScores);
    };
    fetchScores();
  }, []);

  useEffect(() => {
    const unfoldTimer = setTimeout(() => {
      setIsUnfolded(true);
    }, 200);

    return () => clearTimeout(unfoldTimer);
  }, []);

  const filteredScores = scores
    .filter((score) =>
      viewOption === "All" ? true : score.team === viewOption
    )
    .filter((score) =>
      score.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedTeams = Array.from(
    new Set(scores.map((score) => score.team))
  ).sort();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Filter Options */}
      <div className="absolute top-8 right-8 flex gap-4">
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
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "0.25rem",
            color: "#FFD700",
            fontSize: "0.8rem",
          }}
          className="nes-field"
        />
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
            height: isUnfolded ? "70vh" : 0,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="overflow-y-auto bg-scroll invisible-scrollbar"
          style={{
            alignSelf: "center",
            backgroundImage: "url('/img/paper.png')",
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            width: "432px",
            maxHeight: "80vh",
            borderTop: "2px solid transparent",
            borderBottom: "2px solid transparent",
          }}
        >
          {filteredScores.map((score) => {
            let color = "#000000"; // Default color for other places
            let fontSize = "24px"; // Default font size
            if (score.rank === 1) {
              color = "#FFD700"; // Gold
              fontSize = "32px";
            } else if (score.rank === 2) {
              color = "#C0C0C0"; // Silver
            } else if (score.rank === 3) {
              color = "#CD7F32"; // Bronze
            }

            return (
              <div
                key={score.name}
                className="py-2 px-6 text-brown flex flex-row justify-between"
                style={{ color, fontSize }}
              >
                <span className="font-bold max-w-[300px]">
                  {score.rank}. {score.name} - {score.team}
                </span>
                <span className="float-right">{score.score}</span>
              </div>
            );
          })}
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
