import React, { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Score {
  id: string;
  name: string;
  team: string;
  score: number;
  rank?: number;
}

const LeaderBoard = () => {
  const navigate = useNavigate();

  const [scores, setScores] = useState<Score[]>([]);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [viewOption, setViewOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleMainmenuClick = () => {
    navigate("/");
  };

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

  const categories = [
    "All",
    "ติดตลก",
    "ติดเตียง",
    "ติดบั๊ก",
    "ติดลิฟต์",
    "ติดจุฬา",
    "ติดแกลม",
    "ติดใจ",
    "ติดฝน",
  ];

  const filteredScores = scores
    .filter((score) =>
      viewOption === "All" ? true : score.team === viewOption
    )
    .filter((score) =>
      score.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.score - a.score) 
    .map((score, index) => ({ ...score, rank: index + 1 })); 

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-8 right-8 flex flex-col gap-4 max-w-[80vw] flex-wrap">
        <div className="nes-select is-dark w-[200px] text-sm">
          <select //Filter Options
            required
            id="dark_select"
            value={viewOption}
            onChange={(e) => setViewOption(e.target.value)}
            className="p-1 bg-transparent text-yellow-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <input //Search Bar
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="nes-input is-dark text-sm w-full max-w-[200px] text-white break-words"
        />
        <button //Main Menu
          className="nes-btn is-warning w-full max-w-[200px] break-words"
          onClick={handleMainmenuClick}
        >
          Main Menu
        </button>
      </div>

      <div className="flex flex-col w-[500px]">
        <img
          src="/img/scroll.png"
          alt="Top of Royal Letter"
          className="w-full"
        />

        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: isUnfolded ? "70vh" : 0,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="overflow-y-auto bg-scroll invisible-scrollbar mx-auto bg-cover w-[432px] max-h-[80vh] border-t-2 border-b-2 border-transparent"
          style={{
            backgroundImage: "url('/img/body.png')",
          }}
        >
          {filteredScores.map((score) => {
            let color = "#000000"; 
            let fontSize = "24px";
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
                key={score.id}
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
