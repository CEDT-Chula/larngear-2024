const express = require('express');
const scoreRouter = require('./routes/score');
// const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();


console.log('MONGO_URI:', process.env.MONGO_URI); 

connectDB();

// FOR LIMIT USER
// const limiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 100
// });

const app = express();
app.use(express.json());
// FOR LIMIT USER
// app.use(limiter);
app.use('/api/scores', scoreRouter);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  () => console.log('running on port', PORT)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error1: ${err}`);
  server.close(() => process.exit(1));
});