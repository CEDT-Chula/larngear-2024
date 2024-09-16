import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Home = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/DemoGame");
  };

  const [playerMode, setPlayerMode] = useState("one");

  const handleModeChange = (event) => {
    setPlayerMode(event.target.value);
  };

  return (
    <div className="mt-[80px]">
      <h1 className="nes-text is-primary text-center my-5">
        Welcome to My Phaser React Game!
      </h1>

      <div className="flex flex-col items-center gap-5 mt-[80px]">
        <button
          type="button"
          className="px-10 py-2 nes-btn"
          onClick={handleStartClick}
        >
          Start
        </button>
      </div>

      <div className="flex flex-col items-center gap-5 mt-[80px]">
        <label>
          <input
            type="radio"
            className="nes-radio"
            name="playerMode"
            value="one"
            checked={playerMode === "one"}
            onChange={handleModeChange}
          />
          <span>1 Player</span>
        </label>

        <label>
          <input
            type="radio"
            className="nes-radio"
            name="playerMode"
            value="two"
            checked={playerMode === "two"}
            onChange={handleModeChange}
          />
          <span>2 Player</span>
        </label>
      </div>

      <div className="flex flex-col items-center gap-5 mt-[80px]">
        <button
          type="button"
          className="px-10 py-2 nes-btn"
          onClick={handleStartClick}
        >
          Exit
        </button>
        <img src="src/assets/subaru-duck-pixel.gif" alt="subaru duck dancing" />
      </div>
    </div>
  );
};

export default Home;
