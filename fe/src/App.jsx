import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import DemoGame from "./routes/DemoGame";
import Leaderboard from "./routes/LeaderBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/DemoGame" element={<DemoGame />} />
        <Route path="/LeaderBoard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
