const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewsCSV = './reviewsSimple.csv';
const photosCSV = './photosSimple.csv';

mongoose.connect('mongodb://localhost/basic', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log(`MongoDB Connected!`);
  // addReviews(reviewsCSV);
  addPhotos(photosCSV);
})
.catch((err) => {
  console.log(`MongoDB ERR ${err}`);
});


const schema = new mongoose.Schema({
  product_id: String,
  results: [
      {
        id: String,
        rating: String,
        photos: [{ id: String, url: String }]
      }
  ],
});

const Test = mongoose.model('Examples', schema);

const addReviews = (csvPath) => {

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

    console.log(result);
    Test.findOneAndUpdate(
      {
      "product_id": row.product_id
      },
      {
        '$push': { results: result}
      },
      {
        useFindAndModify: false,
        new: true,
        upsert: true,
        // overwrite: true,
      },
      (err, result) => {
        if(err) {console.log(err)}
        // if(result) {console.log(result)}
      })

    })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} rows`)
  });
}



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

    console.log(photo);

    Test.findOneAndUpdate(
      {
        "results.id": row.review_id,
      },
      {
        $push: { 'results.$.photos': photo}
      },
      {
        useFindAndModify: false,
        new: true,
        // upsert: true,
        // overwrite: true,
      },
      (err, result) => {
        if(err) {console.log(err)}
        // if(result) {console.log(result)}
      })

    })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} rows`)
  });
}
