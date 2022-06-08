const reviewsKeys = [
  id,
  product_id,
  rating,date,
  summary,body,
  recommend,
  reported,
  reviewer_name,
  reviewer_email,
  response,
  helpfulness
];

const photoKeys = [
  id,
  review_id, // id from reviewsKeys
  url
];

const characteristicsReviewsKeys = [
  id,
  characteristic_id,
  review_id,
  value
];

const characteristicsKeys = [
  id,
  product_id,
  name
];


const reviewsCollection = {
  id,
  product_id,
  rating,date,
  summary,body,
  recommend,
  reported,
  reviewer_name,
  reviewer_email,
  response,
  helpfulness,
  'photos': [],

};

{
  "product_id": product_id,
  "results": [
    
  ]
}