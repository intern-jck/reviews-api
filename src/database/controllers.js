const mongoose = require('mongoose');
const Review = require('./ReviewModel.js');

mongoose.connect('mongodb://127.0.0.1:27017/reviews',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB Connected!`);
  })
  .catch((err) => {
    console.log(`MongoDB ERR ${err}`);
  });


// GET REQ
const getReviews = (product_id, type) => {
  console.log(`Getting ${type} for ${product_id}`);
  switch(type) {
    case 'list':
      return Review.find({'product_id': product_id}).select('results')
      .lean()
      .exec();

    case 'meta':
      return Review.find({'product_id': product_id}).select('meta')
      .lean()
      .exec();
  }
}

// const updateReviewCount = () => {
//   return
//     Review.find(
//       { 'product_id': 0 },
//     )
//     .exec();
// }

const addReview = (review) => {
  console.log('New Review', review);

  let newCount = 0;
  // Update Review Count
  Review.find(
    { 'product_id': 0 },
  )
  .exec()
  .then((doc) => {
    console.log('db', doc)
    return doc[0].toObject().review_count;
  })
  .then((data) => {
    console.log(data);
    const filter = { 'product_id': review.product_id};
    const update = {
      $push: {
        results: {
          'id':  data,
          'rating':  review.rating,
          'date': review.date,
          'summary': review.summary,
          'body': review.body,
          'recommend': review.recommend,
          'reported': review.reported,
          'reviewer_name': review.reviewer_name,
          'reviewer_email': review.reviewer_email,
          'response': review.response,
          'helpfulness': review.helpfulness,
        }
      }
    };
    return Review.updateOne(filter, update).exec();
  })
  .catch();
}

module.exports = {
  getReviews, addReview
};