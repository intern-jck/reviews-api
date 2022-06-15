const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { addReviews, addPhotos, addCharacteristics, updateCharacteristics } = require('./etlSetupHelpers.js');

const reviewsCSV = '../../../data-1K/reviews1K.csv';

// const reviewsCSV = '../../../data-50K/reviews50K.csv';
const photosCSV = '../../../data-50K/photos50K.csv';
const characteristicsCSV = '../../../data-50K/characteristics50K.csv';
const characteristicReviewsCSV = '../../../data-50K/characteristicReviews50K.csv';

// const reviewsCSV = '../../data-1M/reviews1M.csv';
// const photosCSV = '../../data-1M/photos1M.csv';

// const reviewsCSV = '../../data-raw/reviewsRaw.csv';
// const photosCSV = '../../data-raw/photosRaw.csv';
// const characteristicsCSV = '../../data-raw/characteristicsRaw.csv';
// const characteristicReviewsCSV = '../../data-raw/characteristicReviewsRaw.csv';

// Need to add a port number?
mongoose.connect('mongodb://127.0.0.1:27017/reviews',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB Connected!`);
  })
  .then(() => {
    addReviews(reviewsCSV);
  })
  // .then(() => {
  //   addPhotos(photosCSV);
  // })
  // .then(() => {
  //   addCharacteristics(characteristicsCSV);
  // })
  // .then(() => {
  //   updateCharacteristics(characteristicReviewsCSV);
  // })
  .catch((err) => {
    console.log(`MongoDB ERR ${err}`);
  });
