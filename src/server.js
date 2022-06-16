const PORT = 3001;
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());



const { getReviews, addReview, getReviewsMeta, markHelpful, reportReview } = require('./database/controllers.js');

app.get('/meta', (req, res) => {

  console.log(req.url);
  console.log(req.query);

  getReviewsMeta(req.query.product_id)
  .then((doc) => {
    res.send(doc);
  })
  .catch((error) => {
    console.log(error)
  });

});

app.get('/list', (req, res) => {

  console.log(req.url);
  console.log(req.query);

  getReviews(req.query.product_id)
  .then((doc) => {
    res.send(doc);
  })
  .catch((error) => {
    res.sendStatus(404);
    console.log(error);
  });

});


app.post('/review', (req, res) => {
  req.body.product_id = req.params.product_id;
  // addReview(req.body)
  //   .then((doc) => {
  //     res.sendStatus(201)
  //   });
});

// app.put('/helpful', (req, res) => {
//   markHelpful(req.params.review_id);
// });

// app.put('/reviews/:review_id/report', (req, res) => {
//   reportReview(req.params.review_id);
// });


app.listen(PORT, function() {
  console.log(`@http://localhost:${PORT} on port ${PORT}`);
});

