const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { addReviews } = require('./etlBasicHelpers.js');

const reviewsCSV = './basicData/reviews100K.csv';

let operations = [];

mongoose.connect('mongodb://127.0.0.1/reviews',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // autoIndex: true
  })
  .then(() => {
    console.log(`MongoDB Connected!`);
  })
  .then(() => {
    console.log(`Adding Reviews`);
    addReviews(reviewsCSV);
  })
  .catch((err) => {
    console.log(`MongoDB ERR ${err}`);
  });

