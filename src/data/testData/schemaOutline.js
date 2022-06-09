// Reviews Product Data
{
  "page": Number,
  "count": Number,

  "product": String,
  "results": [
    {
      "review_id": Number,
      "rating": Number,
      "summary": String,
      "recommend": Boolean,
      "response": null,
      "body": String,
      "date": String,
      "reviewer_name": String,
      "helpfulness": Number,
      "photos": [
        {
          "id": Number,
          "url": String
        },
        // ...
      ]
    },
    {},
    // ...
  ]
}

// Reviews Meta Data
{
  "product_id": String,
  "ratings": {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
  "recommended": {
    0: 5,
    1: 6
  },
  "characteristics": {
    "Fit": {
      "id": Number,
      "value": String // Decimal number ex 3.5000
    },
    "Length": {
      "id": Number,
      "value": String
    },
    "Comfort": {
      "id": Number,
      "value": String
    },
    "Quality": {
      "id": Number,
      "value": String
    },
    "Size": {
      'id': Number,
      'value': String
    },
    "Width": {
      'id': Number,
      'value': String
    }
  }
}
