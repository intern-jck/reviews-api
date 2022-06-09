const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const characteristicsCSV = './testData/charsTest.csv';
const reviewsCharacteristicsCSV = './testData/reviewCharTest.csv';

const metaSchema = new Schema({
  product_id: String,
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
  characteristics: {
    // Fit: {
    //   id: Number,
    //   value: String
    // },
    // Length: {
    //   id: Number,
    //   value: String
    // },
    // Comfort: {
    //   id: Number,
    //   value: String
    // },
    // Quality: {
    //   id: Number,
    //   value: String
    // },
    // Size: {
    //   id: Number,
    //   value: String
    // },
    // Width: {
    //   id: Number,
    //   value: String
    // }
  }
});

mongoose.connect('mongodb://localhost/reviews', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log(`MongoDB Connected!`);
  // initializeReviews(reviewsCSV);
  addCharacteristics(characteristicsCSV);
})
.catch((err) => {
  console.log(`MongoDB ERR ${err}`);
});

const Meta = mongoose.model('Meta', metaSchema);

const addCharacteristics = (csvPath) => {
  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    let characteristic = {};
    let name = row.name;
    characteristic = { [name]: {id: row.id, value: 0} }
    console.log(row.product_id, characteristic);
    // update collection

  });
}