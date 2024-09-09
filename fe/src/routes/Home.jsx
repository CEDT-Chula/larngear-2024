import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/DemoGame");
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
        <img src="src/assets/subaru-duck-pixel.gif" alt="subaru duck dancing" />
      </div>
    </div>
  );
};

export default Home;
