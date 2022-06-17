const { getReviews, addReview, getReviewsMeta, markHelpful, reportReview } = require('../../src/database/controllers.js');


test('getReviews should return an object', () => {
  return getReviews().then((data) => {
    expect(typeof data).toBe('object');
  })
});