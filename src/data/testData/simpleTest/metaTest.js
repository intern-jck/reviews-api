const schema = new mongoose.Schema({
  product_id: String,
  results_meta: [
    {
      id: String,
      rating: Number,
      recommends: Boolean,
      characteristics: [
        {
          id: String,
          name: String,
          value: Number
        }
      ]
    }
  ]
});