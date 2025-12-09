/**
 * Example usage and test script for the TypeScript client.
 * 
 * This file demonstrates how to use the summaryClient and can be used
 * for manual testing when the FastAPI server is running.
 */

import { createSummary, SummaryApiError } from './summaryClient';

async function testClient() {
  const baseUrl = 'http://localhost:8000';

  console.log('Testing TypeScript Client for Text Summarization API\n');

  // Test 1: Normal request with more than 10 words
  try {
    console.log('Test 1: Request with more than 10 words');
    const response1 = await createSummary(baseUrl, {
      text: 'This is a test sentence with exactly fifteen words in total for testing purposes',
    });
    console.log('✅ Success!');
    console.log('Summary:', response1.summary);
    console.log('Word Count:', response1.wordCount);
    console.log('Timestamp:', response1.timestamp);
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('');
  }

  // Test 2: Request with less than 10 words
  try {
    console.log('Test 2: Request with less than 10 words');
    const response2 = await createSummary(baseUrl, {
      text: 'Hello world from TypeScript',
    });
    console.log('✅ Success!');
    console.log('Summary:', response2.summary);
    console.log('Word Count:', response2.wordCount);
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('');
  }

  // Test 3: Error handling - invalid server
  try {
    console.log('Test 3: Error handling - invalid server URL');
    await createSummary('http://localhost:9999', {
      text: 'This should fail',
    });
  } catch (error) {
    if (error instanceof SummaryApiError) {
      console.log('✅ Caught SummaryApiError as expected');
      console.log('Status Code:', error.statusCode);
      console.log('Message:', error.message);
    } else {
      console.log('✅ Caught network error as expected');
      console.log('Error:', error instanceof Error ? error.message : error);
    }
    console.log('');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testClient().catch(console.error);
}

