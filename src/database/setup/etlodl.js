// const addPhotos = (csvPath) => {

//   console.log(`Adding Photos`);
//   const t0 = performance.now();

//   fs.createReadStream(path.resolve(__dirname, csvPath))
//   .pipe(csv.parse({ headers: true }))
//   .on('error', error => console.error(error))
//   .on('data', (row) => {

//     const updateOne = {
//       updateOne: {
//         'filter': { "results.id": row.review_id },
//         'update': {
//           $push: { 'results.$.photos': {
//             'id': row.id,
//             'url': row.url,
//           }},
//           'upsert': true
//         },
//       }
//     };

//     operations.push(updateOne);

//     if (operations.length > 5000) {
//       BasicReview.bulkWrite(operations);
//       const tEnd = performance.now();
//       console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ photosLength) * 100)}%`);
//       operations = [];
//     }

//   })
//   .on('end', (rowCount) => {
//     if(operations.length > 0) {
//       BasicReview.bulkWrite(operations);
//       operations = [];
//     }
//     const tEnd = performance.now();
//     console.log(`Added ${rowCount} rows in ${tEnd - t0}`)
//   });
// };

// const addCharacteristics = (csvPath) => {

//   const t0 = performance.now();

//   fs.createReadStream(path.resolve(__dirname, csvPath))
//   .pipe(csv.parse({ headers: true }))
//   .on('error', error => console.error(error))
//   .on('data', (row) => {

//     const newCharacteristic = {};
//     newCharacteristic['meta.characteristics.' + row.id] = {
//       name: row.name,
//       value: []
//     };

//     const updateOne = {
//       updateOne: {
//         'filter': { 'product_id': row.product_id },
//         'update': {
//           $set: newCharacteristic
//         },
//       }
//     };

//     operations.push(updateOne)

//     if(operations.length > 5000) {
//       BasicReview.bulkWrite(operations);
//       const tEnd = performance.now();
//       console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ chracteristicsLength) * 100)}%`);
//       operations = [];
//     }

//   })
//   .on('end', (rowCount) => {
//     if(operations.length > 0) {
//       BasicReview.bulkWrite(operations);
//       operations = [];
//     }
//     const tEnd = performance.now();
//     console.log(`Added ${rowCount} rows in ${tEnd - t0}`)
//   });

// };

// const updateCharacteristics = (csvPath) => {

//   const t0 = performance.now();

//   fs.createReadStream(path.resolve(__dirname, csvPath))
//   .pipe(csv.parse({ headers: true }))
//   .on('error', error => console.error(error))
//   .on('data', (row) => {

//     const updateCharacteristic = {};
//     updateCharacteristic['meta.characteristics.' + row.characteristic_id + '.value'] = parseInt(row.value);

//     const updateOne = {
//       updateOne: {
//         'filter': { 'results.id': row.review_id },
//         'update': {
//           $push: updateCharacteristic,
//         },
//       }
//     };

//     operations.push(updateOne)

//     if(operations.length > 5000) {
//       BasicReview.bulkWrite(operations);
//       const tEnd = performance.now();
//       console.log(`Bulk Update @ ${Math.round(tEnd - t0)} : ${Math.round((parseInt(row.id)/ reviewChracteristicsLength) * 100)}%`);
//       operations = [];
//     }

//   })
//   .on('end', (rowCount) => {
//     if(operations.length > 0) {
//       BasicReview.bulkWrite(operations);
//       operations = [];
//     }
//     const tEnd = performance.now();
//     console.log(`Added ${rowCount} rows in ${tEnd - t0}`)
//   });

// };
