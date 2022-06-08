const mongoose = require('mongoose');
const { Schema } = mongoose;

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

module.exports = reviewSchema;