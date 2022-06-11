const mongoose = require('mongoose');
const { Schema } = mongoose;

const BasicSchema = new Schema({
  product_id: { type: String, unique: true },
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
  }],
  meta: {
    ratings: {
      1: Number,
      2: Number,
      3: Number,
      4: Number,
      5: Number
    },
    recommended: {
      0: Number,
      1: Number
    },
    characteristics: {}
  }
});

const BasicReview = mongoose.model('Reviews', BasicSchema);
module.exports = BasicReview;