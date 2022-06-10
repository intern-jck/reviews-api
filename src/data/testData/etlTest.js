const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Helpers to build collection.
// Add the reviews first,
// then reviews' photos,
// then reviews' characteristics
// then update each characteristic with name and values,
// then update values by reducing value
// to average of array.
const {
  addReviews,
  addPhotos,
  addCharacteristics,
  updateCharacteristics } = require('./etlTestHelpers.js');
  // TODO:
  // Update characteristic values to average of array values.

const reviewsCSV = './reviewsSimple.csv';
const photosCSV = './photosSimple.csv';
const characteristicsCSV = '../charsTest.csv';
const reviewsCharacteristicsCSV = '../reviewCharTest.csv';

mongoose.connect('mongodb://localhost/basic', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log(`MongoDB Connected!`);
})
.then(() => {
  console.log(`Adding Reviews`);
  addReviews(reviewsCSV);
})
.then(() => {
  console.log(`Adding Photos`);
  addPhotos(photosCSV);
})
.then(() => {
  console.log(`Adding characteristics`);
  addCharacteristics(characteristicsCSV);
})
.then(() => {
  console.log(`Updating characteristics`);
  updateCharacteristics(reviewsCharacteristicsCSV);
})
.catch((err) => {
  console.log(`MongoDB ERR ${err}`);
});


