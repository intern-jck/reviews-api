const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');

const Reviews = require('./ReviewsModel.js');
console.log(Reviews);

// const reviewsCSV = './data/scaledTestData/reviewsScaledHalf.csv';
const reviewsCSV = './data/testData/reviewsTest.csv';

let operations = [];

const addReviews = (csvPath) => {

  const t0 = performance.now();
  let operations = [];
  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {

    // query here
    let result = {};S

    // Build result
    Object.keys(row).map((key, i) => {
      if (key !== 'product_id') {
        result[key] = row[key];
      }
    });


    console.log(result);


  })
  .on('end', (rowCount) => {
    const t1 = performance.now();
    console.log(`Added ${rowCount} rows @ ${Math.round(t1 - t0)}`)

  });

};

mongoose.connect('mongodb://127.0.0.1/reviews', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log(`MongoDB Connected!`);
})
.then(() => {
  console.log(`Adding Reviews`);
  addReviews(reviewsCSV);
})
// .then(() => {
//   console.log(`Adding Photos`);
//   addPhotos(photosCSV);
// })
// .then(() => {
//   console.log(`Adding characteristics`);
//   addCharacteristics(characteristicsCSV);
// })
// .then(() => {
//   console.log(`Updating characteristics`);
//   updateCharacteristics(reviewsCharacteristicsCSV);
// })
.catch((err) => {
  console.log(`MongoDB ERR ${err}`);
});
