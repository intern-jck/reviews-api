const mongoose = require('mongoose');
const { Schema } = mongoose;

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

// const csvStream = csv.format({ headers: true });
// cvsStream.pipe(process.stdout).on('end', () => process.exit());

fs.createReadStream(path.resolve(__dirname, 'assets', '../test-data/reviews-test.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    console.log(row);

  })
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

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

// const reviewsMetaSchema = new Schema({
//   product_id: String,
//   ratings: {
//   }
// });