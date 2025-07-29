// Import required K6 modules for HTTP requests, test checks, and sleep pacing
import http from 'k6/http';
import { check, sleep } from 'k6';

// Define load test stages: ramp-up, sustain load, and ramp-down
export let options = {
  stages: [
    { duration: '30s', target: 50 },   // Gradually increase to 50 virtual users over 30 seconds
    { duration: '1m', target: 100 },   // Hold at 100 virtual users for 1 minute
    { duration: '30s', target: 0 },    // Gradually decrease to 0 virtual users over 30 seconds
  ],
};

// Sample recipient email addresses
const receivers = [
  'alice@yopmail.com',
  'bob@yopmail.com',
  'charlie@yopmail.com',
  'dave@yopmail.com',
];

// Sample email subjects
const subjects = [
  'Welcome!',
  'Important Update',
  'Test Submission',
  'Happy New Month',
];

// Sample email body messages
const bodies = [
  'Thank you for signing up.',
  'Please verify your email address.',
  'We have updated our terms.',
  'Here are your monthly updates.',
];

/**
 * Default function executed by each virtual user (VU)
 * This simulates sending an email with a POST request to the target API
 */
export default function () {

    /**
     * Generate a single random index between 0 and 4 (inclusive).
     * This index will be reused across all virtual users (which is not ideal for dynamic variation).
     */
    const randItem = Math.floor(Math.random() * 5);

  // Construct the email payload using the fixed random index
  const payload = JSON.stringify({
    to: receivers[randItem],
    subject: subjects[randItem],
    body: bodies[randItem],
  });

  // Set headers for JSON content type
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send POST request to the email API with the constructed payload
  let res = http.post('http://mock.api/send-email', payload, params);

  // Run assertions to validate response
  check(res, {
    'status is 200': (r) => r.status === 200,                   // Response must be HTTP 200 OK
    'response time < 500ms': (r) => r.timings.duration < 500,  // Response time should be under 500ms
  });

  sleep(1); // Sleep for 1 second before next iteration to simulate realistic pacing
}
