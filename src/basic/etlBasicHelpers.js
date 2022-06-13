const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');

const photosLength = 2742540;

const BasicReview = require('./BasicModel.js');
console.log(BasicReview)

let operations = [];

const addReviews = (csvPath) => {
  console.log(`Adding Reviews`);

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

    const filter = { product_id: row.product_id };
    const update = {
        'product_id': row.product_id,
        '$push': { results: result },
        '$inc': updateRating,
        '$inc': updateRecommends
    };

    const updateOne = {
      updateOne: {
        filter,
        update,
        'upsert': true
      }
    };

    operations.push(updateOne)

    if(operations.length > 10000) {
      const tEnd = performance.now();
      console.log(`Bulk Update @ ${Math.round(tEnd - t0)}`);
      BasicReview.bulkWrite(operations);
      operations = [];
    }

  })
  .on('end', (rowCount) => {
    if(operations.length > 0) {
      console.log('bulk update');
      BasicReview.bulkWrite(operations);
      operations = [];
    }
    const tEnd = performance.now();
    console.log(`Added ${rowCount} rows in ${tEnd - t0}`);
  });
};

const addPhotos = (csvPath) => {

  console.log(`Adding Photos`);
  const t0 = performance.now();

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

    const filter = { "results.id": row.review_id };
    const update = {
        $push: { 'results.$.photos': photo}
    };

    // Not sure if this is needed right now...
    // const updateOneCallBack = (error, result) => {
    //   // if (error) {
    //   //     // console.log(`ERROR: ${error}`)
    //   //   }
    //   // if (result) {
    //   //   const tAdded = performance.now();
    //   //   console.log(`ADDED: ${row.product_id} @ ${tAdded - t0}`)
    //   // }
    // }
    // BasicReview.updateOne( filter, update, updateOneCallBack );

    const updateOne = {
      updateOne: {
        filter,
        update,
      }
    };

    operations.push(updateOne)
//Math.round(parseInt(row.id)/photosLength
    if(operations.length > 10000) {
      BasicReview.bulkWrite(operations);
      const tEnd = performance.now();
      console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ photosLength) * 100)}%`);
      operations = [];
    }

  })
  .on('end', (rowCount) => {
    if(operations.length > 0) {
      console.log('bulk update');
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

    // Filter
    const filter = { 'product_id': row.product_id };

    // Update
    let characteristic = {};
    characteristic = {name: row.name, value:[]};
    let characteristicKey = 'meta.characteristics.' + row.id;
    const newCharacteristic = {};
    newCharacteristic[characteristicKey] = characteristic;
    const update = {
        $set: newCharacteristic
    };

    // Options

    // Callback
    // Not sure if this is needed right now...
    const updateOneCallBack = (error, result) => {
      // if (error) {
      //     console.log(`ERROR: ${error}`)
      //   }
      // if (result) {
      //   const tAdded = performance.now();
      //   console.log(`ADDED: ${row.id} @ ${tAdded - t0}`)
      // }
    }

    // BasicReview.updateOne( filter, update, updateOneCallBack );

    const updateOne = {
      updateOne: {
        filter,
        update,
      }
    };

    operations.push(updateOne)

    if(operations.length > 10000) {
      console.log('bulk update');
      BasicReview.bulkWrite(operations);
      operations = [];
    }

  })
  .on('end', (rowCount) => {
    if(operations.length > 0) {
      console.log('bulk update');
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

    const filter = { 'results.id': row.review_id };

    const updateCharacteristic = {};
    const characteristicKey = 'meta.characteristics.' + row.characteristic_id + '.value';
    updateCharacteristic[characteristicKey] = parseInt(row.value);
    const update = {
      $push: updateCharacteristic,
    };

    // Callback
    // Not sure if this is needed right now...
    const updateOneCallBack = (error, result) => {
      if (error) {
            console.log(`ERROR: ${error}`)
          }
      // if (result) {
      //     const tAdded = performance.now();
      //     console.log(`ADDED: ${row.id} @ ${tAdded - t0}`)
      //   }
    }

    // BasicReview.updateOne( filter, update, updateOneCallBack );

    const updateOne = {
      updateOne: {
        filter,
        update,
      }
    };

    operations.push(updateOne)

    if(operations.length > 10000) {
      console.log('bulk update');
      BasicReview.bulkWrite(operations);
      operations = [];
    }

  })
  .on('end', (rowCount) => {
    if(operations.length > 0) {
      console.log('bulk update');
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