const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewStatsSchema = new Schema({
  product_id: { type: Number, default: -1},
  product_count: Number,
  review_count: Number,
  }
);

const ReviewStats = mongoose.model('Tests', ReviewStatsSchema);
module.exports = ReviewStats;