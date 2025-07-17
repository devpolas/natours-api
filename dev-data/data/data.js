require('@dotenvx/dotenvx').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => {
  console.log('database connection successful!');
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const insertTours = async () => {
  try {
    await Tour.create(tours);
    console.log('Tour Data Insert Successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tour Data Deleted Successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  insertTours();
} else if (process.argv[2] === '--delete') {
  deleteTours();
} else {
  console.log(
    'use like this syntax: node dev-data/data/data.js --import || --delete'
  );
  process.exit();
}
