

// POST REQ BODY
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
      results: {
        'id':  row.id,
        'rating':  row.rating,
        'date': row.date,
        'summary': row.summary,
        'body': row.body,
        'recommend': row.recommend,
        'reported': row.reported,
        'reviewer_name': row.reviewer_name,
        'reviewer_email': row.reviewer_email,
        'response': row.response,
        'helpfulness': row.helpfulness,
      }
//     },
//     '$inc': updateRating,
//     '$inc': updateRecommends
//   },
//   'upsert': true
// }
