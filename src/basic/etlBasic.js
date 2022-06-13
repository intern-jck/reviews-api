const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { addReviews, addPhotos } = require('./etlBasicHelpers.js');

const reviewsCSV = '../../data-50k/reviews50k.csv';
const photosCSV = '../../data-50k/photos50k.csv';

// Need to add a port number?
mongoose.connect('mongodb://127.0.0.1/reviews',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB Connected!`);
  })
  .then(() => {
    console.log(`Adding Reviews`);
    // addReviews(reviewsCSV);
  })
  .then(() => {
    console.log(`Adding Photos`);
    addPhotos(photosCSV);
  })
  .catch((err) => {
    console.log(`MongoDB ERR ${err}`);
  });