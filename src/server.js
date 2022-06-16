const PORT = 3000;
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const { getReviews, addReview, getReviewsMeta, markHelpful, reportReview } = require('./database/controllers.js');

app.get('/reviews/:product_id/meta', (req, res) => {
  getReviewsMeta(req.params.product_id)
  .then((doc) => {
    const chars = doc[0].meta.characteristics;
    for (let c in chars) {
      chars[chars[c].name] = { 'id': c, 'value': chars[c].value.reduce((a, b) => (a + b)) / chars[c].value.length};
      delete chars[c];
    }
    res.send(doc);
  })
  .catch((error) => {
    console.log(error)
  });
});

app.get('/reviews/:product_id/list', (req, res) => {
  getReviews(req.params.product_id)
  .then((doc) => {
    doc[0].product_id = req.params.product_id;
    doc[0].page = 1;
    doc[0].count = req.query.count;
    res.send(doc);
  })
  .catch((error) => {
    res.sendStatus(404);
    console.log(error);
  });
});

app.post('/reviews/:product_id', (req, res) => {
  req.body.product_id = req.params.product_id;
  addReview(req.body)
    .then((doc) => {
      res.sendStatus(201)
    });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  markHelpful(req.params.review_id);
});

app.put('/reviews/:review_id/report', (req, res) => {
  reportReview(req.params.review_id);
});

app.listen(PORT, function() {
  console.log(`@http://localhost:${PORT} on port ${PORT}`);
});