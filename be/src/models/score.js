const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  score: { type: Number, required: true },
  updatedAt: { type: Date, required: true }
},  { collection: 'scores' });

const Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;