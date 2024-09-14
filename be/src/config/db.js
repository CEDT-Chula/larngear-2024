const mongoose = require('mongoose');
require('dotenv').config({ path: './src/config/config.env' });


const connectDB = async () => {
  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
  mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to', mongoose.connection.db.databaseName);
  });
  
};

module.exports= connectDB;