const mongoose = require('mongoose');
const { Schema } = mongoose;

main().catch(err => console.log(err));



const reviewSchema = new Schema({
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
  }]
});


const Review = mongoose.model('Review', reviewSchema);

const review = new Review();
console.log(review.results);


const initializeData = (path) => {
  console.log(csvPath);
  fs.createReadStream(path.resolve(__dirname, 'assets', csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    // console.log(row);

  })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} rows`)
    return rowCount
  });
};