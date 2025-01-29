// import fetch from 'node-fetch';
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import the generative AI client

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI("AIzaSyDWSBipNNss-drlWLgfqa_9FcPKlELkMto"); // Ensure the API key is set in the environment

// Function to interact with the third-party API and generate test cases using Gemini
async function generateTestCasesFromResponse(url, method, headers) {
  try {
    // Hit the third-party API and get the response
    const response = await fetch(url, { method, headers });

    if (!response.ok) {
      throw new Error('Failed to fetch from third-party API');
    }

    const responseData = await response.json(); // Get the dynamic response data

    // console.log('Third-party API response:', responseData);

    // Call the function to generate test cases based on the response data
    const testCases = await generateTestCasesWithGemini(responseData, url, method, headers);
    // console.log(testCases);

    // Return the generated test cases
    return testCases;
  } catch (error) {
    console.error('Error:', error);
    throw error;  // Re-throw to be caught by the caller
  }
}

// Function to send the response data to Gemini API and generate test cases based on it
async function generateTestCasesWithGemini(responseData, url, method, headers) {
  const geminiApiKey = "AIzaSyDWSBipNNss-drlWLgfqa_9FcPKlELkMto"; // Get the Gemini API key from config

  try {
    // Construct the prompt that includes the dynamic details
    const prompt = `
      URL: ${url}
      Method: ${method}
      Headers: ${JSON.stringify(headers)}
      Response: ${JSON.stringify(responseData)}

      Generate test cases for this request:
    `;

    // Call the Gemini API to generate test cases based on the constructed prompt
    const result = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent(prompt);

    // Extract the test cases from the result
    const testCases = result.response.text(); // Adjust based on response format
    return testCases;
  } catch (error) {
    console.error('Error generating test cases from Gemini:', error);
    return null;  // Return null in case of an error
  }
}

module.exports = { generateTestCasesFromResponse }; // Export the function to be used in other files
