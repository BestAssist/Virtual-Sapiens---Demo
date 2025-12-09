# Testing the POST /summaries Endpoint

## Quick Testing Methods

### 1. Using Swagger UI (Easiest - Visual Interface)

1. Start the server: `uvicorn main:app --reload`
2. Open your browser: `http://localhost:8000/docs`
3. Click on `POST /summaries`
4. Click "Try it out"
5. Enter your JSON payload:
   ```json
   {
     "text": "This is a test sentence with exactly fifteen words in total for testing purposes"
   }
   ```
6. Click "Execute"
7. See the response below

### 2. Using curl (Command Line)

#### Test with more than 10 words (should return exactly 10):
```bash
curl -X POST "http://localhost:8000/summaries" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"This is a test sentence with exactly fifteen words in total for testing purposes\"}"
```

#### Test with exactly 10 words:
```bash
curl -X POST "http://localhost:8000/summaries" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"one two three four five six seven eight nine ten\"}"
```

#### Test with less than 10 words:
```bash
curl -X POST "http://localhost:8000/summaries" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"Hello world from the API\"}"
```

#### Test with a long paragraph:
```bash
curl -X POST "http://localhost:8000/summaries" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"The quick brown fox jumps over the lazy dog and then runs through the forest to find food and water for survival in the wilderness\"}"
```

### 3. Using Python (Interactive)

Create a file `test_manual.py`:
```python
import requests

# Test 1: More than 10 words
response1 = requests.post(
    "http://localhost:8000/summaries",
    json={"text": "This is a test sentence with exactly fifteen words in total for testing purposes"}
)
print("Test 1 - More than 10 words:")
print(f"Status: {response1.status_code}")
print(f"Response: {response1.json()}")
print(f"Word count in summary: {len(response1.json()['summary'].split())}")
print()

# Test 2: Exactly 10 words
response2 = requests.post(
    "http://localhost:8000/summaries",
    json={"text": "one two three four five six seven eight nine ten"}
)
print("Test 2 - Exactly 10 words:")
print(f"Status: {response2.status_code}")
print(f"Response: {response2.json()}")
print(f"Word count in summary: {len(response2.json()['summary'].split())}")
print()

# Test 3: Less than 10 words
response3 = requests.post(
    "http://localhost:8000/summaries",
    json={"text": "Hello world"}
)
print("Test 3 - Less than 10 words:")
print(f"Status: {response3.status_code}")
print(f"Response: {response3.json()}")
print(f"Word count in summary: {len(response3.json()['summary'].split())}")
print()

# Test 4: Long paragraph
long_text = "The quick brown fox jumps over the lazy dog and then runs through the forest to find food and water for survival in the wilderness during the cold winter months when resources are scarce"
response4 = requests.post(
    "http://localhost:8000/summaries",
    json={"text": long_text}
)
print("Test 4 - Long paragraph:")
print(f"Status: {response4.status_code}")
print(f"Response: {response4.json()}")
print(f"Word count in summary: {len(response4.json()['summary'].split())}")
print(f"Total words in input: {len(long_text.split())}")
print()
```

Run it:
```bash
python test_manual.py
```

### 4. Using TypeScript Client

The `test_client.ts` file already has examples. Run it:
```bash
npx ts-node test_client.ts
```

Or create your own test:
```typescript
import { createSummary } from './summaryClient';

async function test() {
  // Test with more than 10 words
  const result1 = await createSummary('http://localhost:8000', {
    text: 'This is a test sentence with exactly fifteen words in total for testing purposes'
  });
  console.log('Test 1 - More than 10 words:');
  console.log('Summary:', result1.summary);
  console.log('Word Count:', result1.wordCount);
  console.log('Expected: 10 words');
  console.log();

  // Test with exactly 10 words
  const result2 = await createSummary('http://localhost:8000', {
    text: 'one two three four five six seven eight nine ten'
  });
  console.log('Test 2 - Exactly 10 words:');
  console.log('Summary:', result2.summary);
  console.log('Word Count:', result2.wordCount);
  console.log();
}

test().catch(console.error);
```

### 5. Running Automated Tests

Run all pytest tests:
```bash
pytest test_main.py -v
```

Run a specific test:
```bash
pytest test_main.py::test_summary_with_more_than_10_words -v
```

## Expected Results

### Input: "This is a test sentence with exactly fifteen words in total for testing purposes" (15 words)
**Expected Output:**
```json
{
  "summary": "This is a test sentence with exactly fifteen words in",
  "timestamp": "2024-01-15T10:30:45.123456+00:00",
  "word_count": 10
}
```
✅ Should return exactly 10 words

### Input: "one two three four five six seven eight nine ten" (10 words)
**Expected Output:**
```json
{
  "summary": "one two three four five six seven eight nine ten",
  "timestamp": "2024-01-15T10:30:45.123456+00:00",
  "word_count": 10
}
```
✅ Should return all 10 words

### Input: "Hello world" (2 words)
**Expected Output:**
```json
{
  "summary": "Hello world",
  "timestamp": "2024-01-15T10:30:45.123456+00:00",
  "word_count": 2
}
```
✅ Should return all 2 words (fewer than 10)

## Testing Edge Cases

### Multiple spaces:
```json
{"text": "  word1   word2    word3  word4  word5  word6  word7  word8  word9  word10  word11  "}
```
Should still return exactly 10 words.

### Empty text (should fail):
```json
{"text": ""}
```
Should return 422 validation error.

### Only whitespace (should fail):
```json
{"text": "   \n\t  "}
```
Should return 422 validation error.

