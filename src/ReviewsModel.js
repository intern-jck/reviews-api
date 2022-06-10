const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewsSchema = new Schema({
  // product_id: { type: String, unique: true},
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

ReviewsSchema.index({ product_id: 1 }, { unique: true });
const Reviews = mongoose.model('Reviews', ReviewsSchema);
module.exports = Reviews;