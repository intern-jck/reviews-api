const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;

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

const Test = mongoose.model('Tests', reviewsSchema);

const addReviews = (csvPath) => {
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

    Test.findOneAndUpdate(
      {
      "product_id": row.product_id
      },
      {
        'product_id': row.product_id,
        '$push': { results: result },
        '$inc': updateRating,
        '$inc': updateRecommends
      },
      {
        useFindAndModify: false,
        new: true,
        upsert: true,
      },
      (err, result) => {
        if(err) {console.log(err)}
        if(result) {console.log(result.product_id)}
      })

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
      },
      (err, result) => {
        if(err) {console.log(err)}
        // if(result) {console.log(result.id)}
      })

    })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} photos`)
  });
};

const addCharacteristics = (csvPath) => {
  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {

    let characteristic = {};
    // let name = row.name;
    // characteristic = {char_id: row.id, value:[]};
    characteristic = {name: row.name, value:[]};

    const update = {};
    // update['meta.characteristics.' + name] = characteristic;
    update['meta.characteristics.' + row.id] = characteristic;


    Test.findOneAndUpdate(
      {
        'product_id': row.product_id,
      },
      {
        $set: update
      },
      {
        useFindAndModify: false,
        // new: true,
        // upsert: true,
      },
      (err, result) => {
        if (err) { console.log('error', err) }
      });

  })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} chracteristics`)
  });

};

const updateCharacteristics = (csvPath) => {
  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    console.log(row);

    const update = {};
    update['meta.characteristics.' + row.characteristic_id + '.value'] = parseInt(row.value);
    // update['meta.characteristics.' + row.characteristic_id + '.value'] = 'results.id';

    console.log(update)
    Test.findOneAndUpdate(
      {
        'results.id': row.review_id,
      },
      {
        $push: update
      },
      {
        useFindAndModify: false
      },
      (err, result) => {
        if (err) { console.log('error', err) }
      });

  })
  .on('end', (rowCount) => {
    console.log(`Updated ${rowCount} characteristics`)
  });

};


module.exports = {
  addReviews,
  addPhotos,
  addCharacteristics,
  updateCharacteristics
};