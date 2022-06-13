
// const addReviews = (csvPath) => {

  //   const t0 = performance.now();
  //   let operations = [];
  //   fs.createReadStream(path.resolve(__dirname, csvPath))
  //   .pipe(csv.parse({ headers: true }))
  //   .on('error', error => console.error(error))
  //   .on('data', (row) => {

  //     // query here
  //     let result = {};S

  //     // Build result
  //     Object.keys(row).map((key, i) => {
  //       if (key !== 'product_id') {
  //         result[key] = row[key];
  //       }
  //     });

  //     console.log(result);

  //   })
  //   .on('end', (rowCount) => {
  //     const t1 = performance.now();
  //     console.log(`Added ${rowCount} rows @ ${Math.round(t1 - t0)}`)

  //   });

  // };



  // .then(() => {
//   console.log(`Adding Photos`);
//   addPhotos(photosCSV);
// })
// .then(() => {
//   console.log(`Adding characteristics`);
//   addCharacteristics(characteristicsCSV);
// })
// .then(() => {
//   console.log(`Updating characteristics`);
//   updateCharacteristics(reviewsCharacteristicsCSV);
// })


    // const filter = { product_id: row.product_id };

    // const update = {
    //     'product_id': row.product_id,
    //     '$push': { results: result },
    //     '$inc': updateRating,
    //     '$inc': updateRecommends
    // };







