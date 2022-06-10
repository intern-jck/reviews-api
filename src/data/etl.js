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
// const {
  // addReviews,
  // addPhotos,
  // addCharacteristics,
  // updateCharacteristics } = require('./etlHelpers.js');
  // TODO:
  // Update characteristic values to average of array values.

// const reviewsCSV = './rawData/reviews.csv';
const reviewsCSV = './scaledTestData/reviewsScaled.csv';
const photosCSV = './rawData/reviews_photos.csv';
const characteristicsCSV = './rawData/characteristics.csv';
const reviewsCharacteristicsCSV = './rawData/characteristic_reviews.csv';

const reviewsSchema = new Schema({
  product_id: { type: String, unique: true},
  results: [{
    id:  String,
    rating:  String,
    date: Date,
    summary: String,
    body: String,
    recommend: Boolean,
    reported: Boolean,
    reviewer_name: String,
    reviewer_email: String,
    response: String,
    helpfulness: Number,
    photos: [{ id: String, url: String }],
  }],
  meta: {
    ratings: {
      1: Number,
      2: Number,
      3: Number,
      4: Number,
      5: Number
    },
    recommended: {
      0: Number,
      1: Number
    },
    characteristics: {}
  }
});

const Reviews = mongoose.model('Reviews', reviewsSchema);

let operations = [];

const addReviews = (csvPath) => {

  const t0 = performance.now();

  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {

    let result = {};
    // Build result
    Object.keys(row).map((key, i) => {
      if (key !== 'product_id') {
        result[key] = row[key];
      }
    });

    const updateRating = {};
    updateRating['meta.ratings.' + row.rating] = 1;
    const updateRecommends = {};
    if (row.recommend === 'false') {
      updateRecommends['meta.recommends.0'] = 1;
    } else if (row.recommend === 'true') {
      updateRecommends['meta.recommends.1'] = 1;
    }

    const findOneAndUpdateScript = {
      'updateOne': {
        'filter': { 'product_id': 'row.product_id' },
        'update': {
          // 'product_id': 'row.product_id',
          '$push': { 'results': result },
          // '$inc': updateRating,
          // '$inc': updateRecommends
        },
        'upsert': true,
      }
    };

    operations.push(findOneAndUpdateScript);

    if (operations.length % 1000 === 0) {
      console.log('updating', operations[0]);
      Reviews.collection.bulkWrite(operations)
      .then((result) => {
        operations = [];
        console.log(`Bulk Update OK!`);
      })
      .catch((error) => { console.log(error) });
    }


    // console.log(row.product_id);

    // const review = {
    //   product_id: row.product_id,
    // }
    // Reviews.create(review, callback);

    Reviews.findOneAndUpdate(
      {
        "product_id": row.product_id
      },
      {
        // 'product_id': row.product_id,
        '$push': { results: result },
        '$inc': updateRating,
        '$inc': updateRecommends
      },
      {
        useFindAndModify: false,
        // new: true,
        upsert: true,
      },
      (err, result) => {
        if(err) {console.log(err)}
        if(result) {console.log(result.product_id)}
      }
    )

  })
  .on('end', (rowCount) => {
    const t1 = performance.now();
    console.log(`Added ${rowCount} rows @ ${(t1 - t0)/1000}`)

  });
};



mongoose.connect('mongodb://localhost/basic', { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
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


