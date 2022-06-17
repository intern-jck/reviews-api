import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10000 },
    { duration: '1m', target: 10000 },
  ],
  thresholds: {
    'http_req_duration': ['avg<2000'],
    'http_req_failed': ['rate<0.01'],
    'http_reqs': ['rate>100'],
  },
};

export default function () {
  http.get('http://localhost:3000/reviews/2/meta');
  sleep(0.01);
}