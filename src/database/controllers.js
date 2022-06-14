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

// Parameter        Type    Description
// product_id       int     Required ID of the product to post the review for
// rating           int     Integer (1-5) indicating the review rating
// summary          text    Summary text of the review
// body             text    Continued or full text of the review
// recommend        bool    Value indicating if the reviewer recommends the product
// name             text    Username for question asker
// email            text    Email address for question asker
// photos           [text]  Array of text urls that link to images to be shown
// characteristics  object  Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...}

// updateOne: {
//   'filter' : { product_id: row.product_id },
//   'update': {
//     'product_id': row.product_id,
//     '$push': {
//       results: {
//         'id':  row.id,
//         'rating':  row.rating,
//         'date': row.date,
//         'summary': row.summary,
//         'body': row.body,
//         'recommend': row.recommend,
//         'reported': row.reported,
//         'reviewer_name': row.reviewer_name,
//         'reviewer_email': row.reviewer_email,
//         'response': row.response,
//         'helpfulness': row.helpfulness,
//       }
//     },
//     '$inc': updateRating,
//     '$inc': updateRecommends
//   },
//   'upsert': true
// }

const addReview = (data) => {

  // console.log(`Adding ${data}`);
  // console.log(data)

  const updateRating = {};
  updateRating['meta.ratings.' + data.rating] = 1;

  const updateRecommends = {};
  if (data.recommend === 'false') {
    updateRecommends['meta.recommends.0'] = 1;
  } else if (data.recommend === 'true') {
    updateRecommends['meta.recommends.1'] = 1;
  }

// const date = new Date()
// console.log(date.toISOString())
  let reviewIdMax;

  return Review.find()
    .sort({'product_id': -1})
    .limit(1)
    .then((doc) => {
      // reviewIdMax = doc[0].results;
      console.log(doc);
      return doc;
    })
    // .exec();

  // return Review.updateOne(
  //   {
  //     'product_id': data.product_id
  //   },
  //   {
  //     'product_id': data.product_id,
  //     '$push': {
  //       results: {
  //         'id':  data.id,
  //         'rating':  data.rating,
  //         'date': new Date().toISOString(),
  //         'summary': data.summary,
  //         'body': data.body,
  //         'recommend': data.recommend,
  //         'reported': data.reported,
  //         'reviewer_name': data.name,
  //         'reviewer_email': data.email,
  //         'response': data.response,
  //         'helpfulness': data.helpfulness,
  //       }
  //     },
  //     '$inc': updateRating,
  //     '$inc': updateRecommends
  //   },
  //   {
  //     'upsert': true
  //   },
  // )
  // .lean()
  // .exec();

}

module.exports = {
  getReviews, addReview
};