const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { addReviews, addPhotos, addCharacteristics, updateCharacteristics } = require('./etlSetupHelpers.js');

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
  .catch((err) => {
    console.log(`MongoDB ERR ${err}`);
  });


addReviews(reviewsCSV);
// addPhotos(photosCSV);
// addCharacteristics(characteristicsCSV);
// updateCharacteristics(characteristicReviewsCSV);