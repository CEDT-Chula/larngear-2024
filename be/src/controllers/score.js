
const Score = require('../models/score');

exports.getScores = async (req, res)=> {
    const { team } = req.query;
  
    try {

      const filter = team ? { team } : {};

      const scores = await Score.find(filter)
        .sort({ score: -1, updatedAt: 1 }); 
  
      res.status(200).json(scores);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


exports.addScore = async (req, res)=> {
  const { name, team, score } = req.body;

  try {

    let existingScore = await Score.findOne({ name, team });

    const currentTime = new Date();

    if (existingScore) {

      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.updatedAt = currentTime;
        await existingScore.save();
      }
      res.status(200).json(existingScore);
    } else {
      const newScore = new Score({
        name,
        team,
        score,
        updatedAt: currentTime
      });
      await newScore.save();
      res.status(201).json(newScore);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getScoreByName = async (req, res) => {
    const { name } = req.params;
  
    try {

      const score = await Score.findOne({ name });
  
      if (score) {
        res.status(200).json(score);
      } else {
        res.status(404).json({ message: 'Score not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };