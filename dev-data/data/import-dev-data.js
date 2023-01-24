const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

// this one execute first before require app since from the app we are defining the env
dotenv.config({ path: './config.env' });

// Replacing password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

dbConnect();

async function dbConnect() {
  try {
    await mongoose.set('strictQuery', true);
    const con = await mongoose.connect(DB);
    console.log('DB Connection Success');
    return con;
  } catch (error) {
    console.log(`DB Connection Failed : ${error}`);
  }
}

// Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('data successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);

// To execute this file. we can use this for cronjobs
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
