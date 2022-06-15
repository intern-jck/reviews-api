
  let newCount = 0;
  // Update Review Count
  Review.find(
    { 'product_id': 0 },
  )
  .exec()
  .then((doc) => {
    console.log('db', doc)
    return doc[0].toObject().review_count;
  })
  .then((reviewCount) => {
    console.log(reviewCount);
    reviewCount ++;
    const filter = { 'product_id': review.product_id};
    const update = {
      $push: {
        results: {
          'id':  reviewCount,
          'rating':  review.rating,
          'date': review.date,
          'summary': review.summary,
          'body': review.body,
          'recommend': review.recommend,
          'reported': review.reported,
          'reviewer_name': review.reviewer_name,
          'reviewer_email': review.reviewer_email,
          'response': review.response,
          'helpfulness': review.helpfulness,
        }
      }
    };
    return Review.updateOne(filter, update).exec();
  })
  .catch();