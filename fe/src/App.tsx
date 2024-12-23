import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Leaderboard from "./routes/LeaderBoard";
import Game from "./routes/Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LeaderBoard" element={<Leaderboard />} />
        <Route path="/Game" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
