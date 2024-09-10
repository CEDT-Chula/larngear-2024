const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  team: { type: String, required: true },
  score: { type: Number, required: true },
  updatedAt: { type: Date, required: true }
});

const Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;