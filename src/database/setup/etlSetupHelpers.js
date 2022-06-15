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
    console.log(typeof row.recommend)
    const updateRating = {};
    updateRating['meta.ratings.' + row.rating] = 1;

    const updateRecommended = {};
    if (row.recommend === 'false') {
      updateRecommended['meta.recommended.0'] = 1;
    } else if (row.recommend === 'true') {
      updateRecommended['meta.recommended.1'] = 1;
    }

    // const reviewOP = {
    //   updateOne: {
    //     'filter' : { 'product_id': row.product_id },
    //     'update': {
    //       '$push': {
    //         'results': {
    //           'id':  row.id,
    //         }
    //       },
    //       '$inc': updateRating,
    //       // '$inc': updateRecommends
    //     },
    //     'upsert': true
    //   }
    // };

    const reviewOP = {
      updateOne: {
        'filter': { 'product_id': row.product_id},
        'update': {
          '$push': {
            'results': {
              'id': row.id,
            }
          },
          // '$inc': updateRating,
          // '$inc': { 'meta.recommended.0': 1}
          '$inc': updateRecommended
        },
        'upsert': true,
      }
    }



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

    // // Hacky way to keep track of reviews
    // const filter = { 'product_id': 0};
    // const update = { '$set': { 'review_count': rowCount } }
    // const options = {
    //   returnNewDocument: true,
    //   new: true,
    //   strict: false,
    //   upsert: true
    // }

    // const callback = (err, doc) => {
    //   if (err) { console.log(err) }
    //   if (doc) { console.log(doc) }
    //   console.log('end')
    // };

    // BasicReview.findOneAndUpdate(filter, update, options, callback);

  });
};


module.exports = {
  addReviews,
  // addPhotos,
  // addCharacteristics,
  // updateCharacteristics
};