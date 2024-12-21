const express = require('express');
const cors = require('cors');
const scoreRouter = require('./routes/score');
// const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config({ path: './src/config/.env' });






// FOR LIMIT USER
// const limiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 100
// });

const app = express();

app.use(cors());

console.log('MONGO_URI:', process.env.MONGO_URI); 

connectDB();


app.use(express.json());
// FOR LIMIT USER
// app.use(limiter);
app.use('/api/scores', scoreRouter);

const PORT = process.env.PORT || 5000;

console.log('PORT:', process.env.PORT);
const server = app.listen(
  PORT,
  () => console.log('running on port', PORT)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error1: ${err}`);
  server.close(() => process.exit(1));
});