
const getReviewsOfProduct = (id = 1, sortString = "relevant", count = 20) => {
  return axios.get(
    `${url}/reviews/${id}/list?sort=${sortString}:asc&count=${count}}`
    );
  };

  const getReviewMetaData = (id = 1) => {
    return axios.get(`${url}/reviews/${id}/meta`);
  };

const reportReview = (reviewId) => {
  return axios.put(`${url}/reviews/report/${reviewId}`);
};

const postReview = (
  id = 1,
  rating,
  summary,
  body,
  recommend,
  name,
  email,
  photos,
  characteristics
) => {
  return axios.post(`${url}/reviews/${id}`, {
    rating: rating,
    summary: summary,
    body: body,
    recommend: recommend,
    name: name,
    email: email,
    photos: photos,
    characteristics: characteristics,
  });
};
