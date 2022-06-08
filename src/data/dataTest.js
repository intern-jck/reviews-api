const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;
// const reviewsSchema = require('./reviewsSchema.js')
const reviewsCSV = '../testData/reviewsTest.csv'

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
    initializeData(reviewsCSV);
  })
  .catch((err) => {
    console.log(`MongoDB ERR ${err}`);
  });

const Reviews = mongoose.model('Reviews', reviewsSchema);

const initializeData = (csvPath) => {
  console.log(csvPath);

  let buffer = [];
  let counter = 0;

  fs.createReadStream(path.resolve(__dirname, 'assets', csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    let result = {};
    Object.keys(row).map((key, i) => {
      if (key !== 'product_id') {
        result[key] = row[key];
      }
    });
    Reviews.findOneAndUpdate(
      {
        product_id: row.product_id
      },
      {
        $push: { results: result}
      },
      {
        useFindAndModify: false,
        new: true,
        upsert: true,
      },
      (err, results) => {
        if (err) {
          console.log(err)
        }
        // if (results) {
        //   console.log(results)
        // }
      });

  })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} rows`)
  });
};


module.exports = {
  initializeData,
};