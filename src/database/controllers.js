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

module.exports = {
  getReviews,
};