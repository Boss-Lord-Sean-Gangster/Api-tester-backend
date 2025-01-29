const express = require('express');
const { generateTestCasesFromResponse } = require('./gemini'); // Import the geminiService function
const cors = require('cors');

const app = express();

// Enable CORS for your local frontend (update the URL if needed for production)
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware to parse JSON bodies
app.use(express.json());

// Define the endpoint that triggers the third-party API and generates test cases
app.post('/generate-test-cases', async (req, res) => {
  // Extract dynamic data from the request body
  const { url, method, headers } = req.body;

  if (!url || !method || !headers) {
    return res.status(400).json({ error: 'Missing URL, method, or headers in the request' });
  }

  try {
    // Call the service function that interacts with the third-party API and generates test cases
    const testCases = await generateTestCasesFromResponse(url, method, headers);

    if (testCases) {
      return res.json({ testCases });  // Return generated test cases
    } else {
      return res.status(500).json({ error: 'Failed to generate test cases' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error generating test cases', details: error.message });
  }
});

// Use Heroku's dynamic port or fallback to 3000 for local development
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
