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

const addReview = (review) => {
  console.log('New Review', review);
  return Review.findOneAndUpdate(
    { 'product_id': 0 },
    {
      '$inc': { 'review_count': 1}
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

      const incUpdates = {};
      // Increment meta.ratings by 1
      incUpdates['meta.ratings.' + review.rating] = 1;
      // Increment meta.recommended by 1
      if (review.recommend === 'false') {
        incUpdates['meta.recommended.0'] = 1;
      } else if (review.recommend === 'true') {
        incUpdates['meta.recommended.1'] = 1;
      }

      const update = {
        '$push': {
          'results': {
            'id':  doc.review_count + 1,
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

      for (let key in review.characteristics) {
        update.$push['meta.characteristics.' + key + '.value'] = parseInt(review.characteristics[key])
      }

      return Review.updateOne(
        { 'product_id': review.product_id },
        update,
        { 'upsert': true }
      );
    })
}













module.exports = {
  getReviews, addReview
};