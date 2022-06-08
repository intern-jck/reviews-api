import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewsSchema = new Schema({
  product_id: String,
  results: [{
    review_id:  String,
    date: Date,
    rating:  String,
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

