import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/Game");
  };
  const handleLeaderboardClick = () => {
    navigate("/LeaderBoard");
  };

  return (
    <div className="relative h-[100vh]">
      <div className="absolute top-1 left-0 w-full h-[60px] overflow-hidden bg-transparent">
        <div className="sliding-bar animate-slide-left">
          {Array.from({ length: 50 }).map((_, index) => (
            <img key={`left-${index}`} src="croissant.png" alt="croissant" />
          ))}
          {Array.from({ length: 50 }).map((_, index) => (
            <img
              key={`left-dup-${index}`}
              src="croissant.png"
              alt="croissant"
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-1 left-0 w-full h-[60px] overflow-hidden bg-transparent">
        <div className="sliding-bar animate-slide-right">
          {Array.from({ length: 50 }).map((_, index) => (
            <img key={`right-${index}`} src="croissant.png" alt="croissant" />
          ))}
          {Array.from({ length: 50 }).map((_, index) => (
            <img
              key={`right-dup-${index}`}
              src="croissant.png"
              alt="croissant"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col h-full justify-center gap-4">
        <h1 className="nes-text is-warning text-center my-5 text-4xl">
          Croissant Tower Defense
        </h1>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            className="px-4 py-1 nes-btn is-warning text-2xl"
            onClick={handleStartClick}
          >
            Start
          </button>
          <button
            type="button"
            className="px-4 py-1 nes-btn is-warning text-2xl"
            onClick={handleLeaderboardClick}
          >
            LeaderBoard
          </button>
          <img
            src="src/assets/subaru-duck-pixel.gif"
            alt="subaru duck dancing"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
