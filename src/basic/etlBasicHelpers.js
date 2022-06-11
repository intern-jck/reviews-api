const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');

const BasicReview = require('./BasicModel.js');
console.log(BasicReview)

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

    const newReview = new BasicReview({
      product_id: row.product_id,

    });

    newReview.save((error, result) => {

      // Is this good form?
      // error ?
      //   console.log(error)
      //   : result ?
      //     console.log(result)
      //     : null;

      if (error) {
        // console.log(`ERROR: ${error.code}`)
        const tAddError = performance.now();
      }
      if (result) {
        const tAdded = performance.now();

        console.log(`ADDED: ${result.product_id} @ ${tAdded - t0}`)
      }

    })
    // .then((result) => {
    //   const tFinished = performance.now();
    //   console.log(result)
    // })
    // .catch((error) => {
    //   const tError = performance.now();
    //   console.log(`ERROR @ ${tError - t0} >>>> ${error}`)
    // });

    // Test.findOneAndUpdate(
    //   {
    //   "product_id": row.product_id
    //   },
    //   {
    //     'product_id': row.product_id,
    //     '$push': { results: result },
    //     '$inc': updateRating,
    //     '$inc': updateRecommends
    //   },
    //   {
    //     useFindAndModify: false,
    //     new: true,
    //     upsert: true,
    //   },
    //   (err, result) => {
    //     if(err) {console.log(err)}
    //     // if(result) {console.log(result)}
    //   })

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