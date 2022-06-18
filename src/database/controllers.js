require('dotenv').config();
//console.log(process.env);
const mongoose = require('mongoose');
const Review = require('./ReviewModel.js');
const mongoURL = `mongodb://${process.env.REVIEWS_USER}:${process.env.REVIEWS_PWD}@${process.env.DATABASE_IP}:27017/reviews`;

mongoose.connect(mongoURL,
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
const getReviews = (product_id) => {
  return Review.find({'product_id': product_id}).select('results')
  // .lean()
  .exec();
};

const getReviewsMeta = (product_id) => {
  return Review.find({'product_id': product_id}).select('meta')
  // .lean()
  .exec();
};

//POST REQ
const addReview = (review) => {
  console.log('New Review', review);

  // Update the review count stored in product 0
  return Review.findOneAndUpdate(
    { 'product_id': 0 },
    {
      '$inc': { 'review_count': 1 }
    },
    {
      new: true,
      strict: false
    }
  )
  .lean()
  .exec()
  .then((doc) => {
    console.log(doc.review_count);

    // When adding a new review, we need to format it properly.
    // We can store all of our update operations in objects,
    // then use them as inputs for our updateOne,
    // keeping things nice and neat.

    // Store all the $inc operations in a single object
    const incUpdates = {};

    // Increment meta.ratings by 1
    incUpdates['meta.ratings.' + review.rating] = 1;

    // Increment meta.recommended by 1 condtionally
    if (review.recommend === 'false') {
      incUpdates['meta.recommended.0'] = 1;
    } else if (review.recommend === 'true') {
      incUpdates['meta.recommended.1'] = 1;
    }

    // Update for rest of review
    const update = {
      '$push': {
        'results': {
          'id': doc.review_count + 1,
          'rating':  review.rating,
          'date': new Date().toISOString(),
          'summary': review.summary,
          'body': review.body,
          'recommend': review.recommend,
          'reported': review.reported,
          'reviewer_name': review.name,
          'reviewer_email': review.email,
          'response': review.response,
          'helpfulness': review.helpfulness,
        }
      },
      '$inc': incUpdates
    }

    // // We need to adjust the format to match whats stored in collection
    for (let key in review.characteristics) {
      update.$push['meta.characteristics.' + key + '.value'] = parseInt(review.characteristics[key])
    }

    // Finally, update review stored in collection.

    const filter = { 'product_id': review.product_id };
    const options = { 'upsert': true };

    return Review.updateOne( filter, update, options )
      .exec();
      // .then((doc) => ( console.log(doc)))
      // .catch((error) => (console.log(error)));

  })
};

//PUT REQ
const markHelpful = (review_id) => {

}

const reportReview = (review_id) => {

}

module.exports = {
  getReviews, addReview, getReviewsMeta, markHelpful, reportReview
};
