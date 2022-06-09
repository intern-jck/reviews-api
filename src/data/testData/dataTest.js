const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;
// const reviewsSchema = require('./reviewsSchema.js')

const reviewsCSV = './testData/reviewsTest.csv';
const photosCSV = './testData/photosTest.csv';

const reviewsSchema = new Schema({
  product_id: String,
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
  }]
});

mongoose.connect('mongodb://localhost/reviews', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log(`MongoDB Connected!`);
  // initializeReviews(reviewsCSV);
  addPhotos(photosCSV);
})
.catch((err) => {
  console.log(`MongoDB ERR ${err}`);
});

const Reviews = mongoose.model('Reviews', reviewsSchema);

const initializeReviews = (csvPath) => {
  console.log(csvPath);

  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    let result = {};
    Object.keys(row).map((key, i) => {
      if (key !== 'product_id') {
        result[key] = row[key];
      }
    });
    // console.log(row.product_id, result);
    Reviews.findOneAndUpdate(
      { product_id: row.product_id },
      { $push: { results: result} },
      {
        useFindAndModify: false,
        new: true,
        upsert: true,
        // overwrite: true,
      },
      (error, results) => {
        if (error) {
          console.log(error)
        }
        if (results) {
          console.log(results)
        }
      }
    );
  })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} rows`)
  });

};



const addPhotos = (csvPath) => {

    fs.createReadStream(path.resolve(__dirname, csvPath))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', (row) => {
      let photo = {};
      Object.keys(row).map((key, i) => {
        if (key !== 'review_id') {
          photo[key] = row[key];
        }
      });

      Reviews.findOneAndUpdate(
        {
          'results.id': row.review_id,
        },
        {
          $push: { 'results.$.photos': photo}
          // 'results.rating': '9'
        },
        {
          useFindAndModify: false,
          new: true,
          // upsert: true,
          // overwrite: true
        },
        (err, results) => {
          if (err) {
            console.log('photo error', err)
          }
          if (results) {
            // console.log()
          }
        });


    })
    .on('end', (rowCount) => {
      console.log(`Added ${rowCount} rows`)
    });
  }


module.exports = {
  initializeReviews,
};