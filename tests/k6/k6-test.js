import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  thresholds: {
    'http_req_duration': ['p(99)<1000'],
    'http_req_failed': ['rate<0.01'],
    'http_reqs': ['rate>1'],
  },
};

export default function () {
  http.get('http://localhost:3000/reviews/2/meta');
  sleep(0.1);
}