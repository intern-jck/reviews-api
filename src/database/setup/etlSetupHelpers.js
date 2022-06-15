const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');

const reviewsLength = 5774952;
const photosLength = 2742540;
const chracteristicsLength = 3347679;
const reviewChracteristicsLength = 19327575;

const BasicReview = require('../ReviewModel.js');

let operations = [];

const addReviews = (csvPath) => {
  console.log(`Adding Reviews`);

  const t0 = performance.now();

  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {

    const updateRating = {};
    updateRating['meta.ratings.' + row.rating] = 1;

    const updateRecommends = {};
    if (row.recommend === 'false') {
      updateRecommends['meta.recommends.0'] = 1;
    } else if (row.recommend === 'true') {
      updateRecommends['meta.recommends.1'] = 1;
    }

    const reviewOP = {
      updateOne: {
        'filter' : { product_id: row.product_id },
        'update': {
          'product_id': row.product_id,
          '$push': {
            results: {
              'id':  row.id,
              'rating': row.rating,
              'date': row.date,
              'summary': row.summary,
              'body': row.body,
              'recommend': row.recommend,
              'reported': row.reported,
              'reviewer_name': row.reviewer_name,
              'reviewer_email': row.reviewer_email,
              'response': row.response,
              'helpfulness': row.helpfulness,
            }
          },
          '$inc': updateRating,
          '$inc': updateRecommends
        },
        'upsert': true
      }
    };

    operations.push(reviewOP);

    if (operations.length > 1000) {
      console.log(updateRating);
      const tEnd = performance.now();
      // console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ reviewsLength) * 100)}%`);
      BasicReview.bulkWrite(operations);
      operations = [];
    }

  })
  .on('end', (rowCount) => {

    if(operations.length > 0) {
      BasicReview.bulkWrite(operations);
      operations = [];
    }

    const tEnd = performance.now();
    console.log(`Added ${rowCount} rows in ${tEnd - t0}`);
    // Hacky way to keep track of reviews
    const filter = { 'product_id': 0};
    const update = { '$set': { 'review_count': rowCount } }
    const options = {
      returnNewDocument: true,
      new: true,
      strict: false,
      upsert: true
    }

    const callback = (err, doc) => {
      if (err) { console.log(err) }
      if (doc) { console.log(doc) }
      console.log('end')
    };

    BasicReview.findOneAndUpdate(filter, update, options, callback);

  });
};

const addPhotos = (csvPath) => {

  console.log(`Adding Photos`);
  const t0 = performance.now();

  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {

    const updateOne = {
      updateOne: {
        'filter': { "results.id": row.review_id },
        'update': {
          $push: { 'results.$.photos': {
            'id': row.id,
            'url': row.url,
          }},
          'upsert': true
        },
      }
    };

    operations.push(updateOne);

    if (operations.length > 5000) {
      BasicReview.bulkWrite(operations);
      const tEnd = performance.now();
      console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ photosLength) * 100)}%`);
      operations = [];
    }

  })
  .on('end', (rowCount) => {
    if(operations.length > 0) {
      BasicReview.bulkWrite(operations);
      operations = [];
    }
    const tEnd = performance.now();
    console.log(`Added ${rowCount} rows in ${tEnd - t0}`)
  });
};

const addCharacteristics = (csvPath) => {

  const t0 = performance.now();

  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {

    const newCharacteristic = {};
    newCharacteristic['meta.characteristics.' + row.id] = {
      name: row.name,
      value: []
    };

    const updateOne = {
      updateOne: {
        'filter': { 'product_id': row.product_id },
        'update': {
          $set: newCharacteristic
        },
      }
    };

    operations.push(updateOne)

    if(operations.length > 5000) {
      BasicReview.bulkWrite(operations);
      const tEnd = performance.now();
      console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ chracteristicsLength) * 100)}%`);
      operations = [];
    }

  })
  .on('end', (rowCount) => {
    if(operations.length > 0) {
      BasicReview.bulkWrite(operations);
      operations = [];
    }
    const tEnd = performance.now();
    console.log(`Added ${rowCount} rows in ${tEnd - t0}`)
  });

};

const updateCharacteristics = (csvPath) => {

  const t0 = performance.now();

  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {

    const updateCharacteristic = {};
    updateCharacteristic['meta.characteristics.' + row.characteristic_id + '.value'] = parseInt(row.value);

    const updateOne = {
      updateOne: {
        'filter': { 'results.id': row.review_id },
        'update': {
          $push: updateCharacteristic,
        },
      }
    };

    operations.push(updateOne)

    if(operations.length > 5000) {
      BasicReview.bulkWrite(operations);
      const tEnd = performance.now();
      console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ reviewChracteristicsLength) * 100)}%`);
      operations = [];
    }

  })
  .on('end', (rowCount) => {
    if(operations.length > 0) {
      BasicReview.bulkWrite(operations);
      operations = [];
    }
    const tEnd = performance.now();
    console.log(`Added ${rowCount} rows in ${tEnd - t0}`)
  });

};

module.exports = {
  addReviews,
  addPhotos,
  addCharacteristics,
  updateCharacteristics
};