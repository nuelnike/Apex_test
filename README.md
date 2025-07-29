# Apex Networks QA Automation Test

## Overview

This repository demonstrates a QA test automation setup for a microservice responsible for **sending emails** via HTTP. It includes:

1. **Postman Collection** (`Apex Networks.postman_collection.json`) for functional API test coverage.
2. **k6 Performance Test Script** (`performancetest`) for load and stress testing of the `/send-email` endpoint.

---

## Functional API Automation with Postman

### Postman File:   `Apex Networks.postman_collection.json`
### K6 File:        `performancetest.js`

### Description Functional Test
This Postman collection tests the `POST /send-email` API using a multi-cycle strategy (1 to 4 test cases). It dynamically switches input values and assertions per test cycle via scripts in the `Pre-request` and `Tests` tabs.

### Description Performance Test
This k6 script simulates load on the `/send-email` endpoint. It randomly selects one of 4 test variations per virtual user.

### File Structure
Apex/
 ┣ Apex Networks.postman_collection.json   # Functional tests
 ┣ performancetest.js                     # k6 performance script
 ┗ README.md                              # This file

### Test Cycles Covered

| Cycle | Test Description                                      | Expected Result           |
|-------|--------------------------------------------------------|---------------------------|
| 1     | Empty `receiver` field                                 | ❌ Should fail             |
| 2     | Invalid email format (`sampleyopmail.com`)             | ❌ Should fail             |
| 3     | Simulated full queue scenario using UID                | ❌ Should fail             |
| 4     | Valid request with proper recipient email              | ✅ Should succeed (200 OK) |

### Environment Variables (Used Internally)

| Variable   | Description                                     |
|------------|-------------------------------------------------|
| `receiver` | Target email address (changes per cycle)        |
| `subject`  | Email subject                                   |
| `body`     | Email body content                              |
| `testCase` | Human-readable label for current test scenario  |
| `cycle`    | Current test cycle index                        |
| `cycles`   | Total number of test cycles                     |

### How It Works
- Each request updates `cycle`, `receiver`, and `testCase` variables.
- The `Tests` script evaluates whether the response is valid or invalid based on the scenario.
- The same request (`API test`) is recursively called until all test cycles complete.
- Cycle resets after final pass.

## Prerequisites
- Node.js v16+
- GO v10+
- Postman (for API tests)

### How To Run (POSTMAN)
- Install & Run Postman
- Import Collection
- Run collection

### How To Run (K6)
- Go to: https://github.com/grafana/k6/releases
- Download the .zip for Windows.
- Extract it and move the k6.exe to a folder (e.g., C:\k6\).
- Add that folder to your system Environment Variables > PATH.
- Open a new terminal and run: k6 version
- On CLI Run: cd path\to\your\project
- On CLI Run: k6 run performancetest.js
- On CLI Run: k6 run performancetest.js --out json=results.json #save test result.

### Assumptions
The `/send-email` endpoint accepts a POST request with the following JSON body:

```json
{
  "to": "user@example.com",
  "subject": "Your subject here",
  "body": "Your email body here"
}
```

### Notes
- The collection uses pm.collectionVariables to persist values across cycles.
- All test logic is embedded in the Postman file—no extra setup is required.
- k6 output provides rich metrics: HTTP duration, error rates, throughput, etc.
- Be sure to check the Pre-request and Tests tabs in Postman to see the test logic.

### Author
- Prepared by: Emmanuel Ikenna Agba-Ogbonna
- Test Type: Functional, Negative/Positive, Load Test
- Tooling: Postman (Newman), k6.