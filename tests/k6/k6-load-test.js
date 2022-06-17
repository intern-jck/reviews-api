import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '30s', target: 100 },
    // // stay at 100 users for 10 minutes
    { duration: '30s', target: 1000 },
    // // ramp-down to 0 users
    // { duration: '30s', target: 0 },
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