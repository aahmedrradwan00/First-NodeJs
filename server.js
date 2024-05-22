// Using Node.js `require()`
const mongoose = require('mongoose');

// // Using ES6 imports
// import mongoose from 'mongoose';

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB');
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Error not form express. like dara base
process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection Errors : ${err.name} || ${err.message}`);
  server.close(() => {
    console.log('ShotDown ...');
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error(`uncaughtException : ${err.name} || ${err.message}`);
  console.log(`ShotDown...`);
  process.exit(1);
});
