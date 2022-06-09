const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewsCSV = './reviewsSimple.csv';
const photosCSV = './photosSimple.csv';
const characteristicsCSV = '../charsTest.csv';
const reviewsCharacteristicsCSV = '../reviewCharTest.csv';

mongoose.connect('mongodb://localhost/basic', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log(`MongoDB Connected!`);
  // addReviews(reviewsCSV);
  // addPhotos(photosCSV);
  addCharacteristics(characteristicsCSV);
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
      }],
  meta: {
    likes: Number,
    characteristics: {}
  }
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

    console.log(result, row);
    Test.findOneAndUpdate(
      {
      "product_id": row.product_id
      },
      {
        'product_id': row.product_id,
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

const addCharacteristics = (csvPath) => {
  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    console.log(row);

    let characteristic = {};
    let name = row.name;
    characteristic = {id: row.id, value: 0};

    let metaFieldName = `meta.characteristics.${name}`;
    console.log(metaFieldName, characteristic)

    const update = {};

    update['meta.characteristics.' + name] = characteristic;
    console.log(update);

    Test.findOneAndUpdate(
      {
        'product_id': row.product_id,
      },
      {
        $set: update
      },
      {
        useFindAndModify: false,
        new: true,
        upsert: true,
      },
      (err, result) => {
        if (err) {
          console.log('error', err)
        }
        if (result) {
          // console.log(result)
        }
      });



  });

}

const addRatingsAndRecs = (csvPath) => {
  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    console.log(row);

    const update = {
      'meta.likes': {
        $cond: {
          if: {

          }
        }
      }
    };

    Test.findOneAndUpdate(
      {
        'product_id': row.product_id,
      },
      {
        $set: {
          // loop through
        }
      },
      {
        useFindAndModify: false,
        // new: true,
      },
      (err, result) => {
        if (err) {
          console.log('error', err)
        }
        if (result) {
          // console.log(result)
        }
      });

  });
}
