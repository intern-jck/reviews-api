const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const csvPathsTest = {
  // 'reviews': '../reviewsTest.csv',
  // 'reviews': '../../reviews-raw/reviews.csv',
  // 'photos': 'photosTest.csv',
  // 'reviewsChars': 'reviewCharTest.csv',
  // 'chars': 'charsTest.csv',
}

const getLength = (csvPath) => {
  console.log(csvPath);
  fs.createReadStream(path.resolve(__dirname, 'assets', csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    // console.log(row);
  })
  .on('end', (rowCount) => {
    console.log(`Parsed ${rowCount} rows`)
    return rowCount
  });
};

// console.log(getLength(csvPathsTest['reviews']));
