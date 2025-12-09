# Quick Start Guide

## Running the Project

### 1. Start the FastAPI Server

```bash
# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

Server will be available at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### 2. Run Tests

```bash
# Make sure virtual environment is activated
pytest test_main.py -v
```

### 3. Test TypeScript Client

```bash
# Install Node dependencies (first time only)
npm install

# Type check
npm run type-check

# Run example (make sure FastAPI server is running)
npx ts-node test_client.ts
```

## Testing the API

### Using curl:

```bash
curl -X POST "http://localhost:8000/summaries" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test sentence with exactly fifteen words in total for testing purposes"}'
```

### Using Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/summaries",
    json={"text": "This is a test sentence with exactly fifteen words in total for testing purposes"}
)
print(response.json())
```

### Using TypeScript:

```typescript
import { createSummary } from './summaryClient';

const result = await createSummary('http://localhost:8000', {
  text: 'This is a test sentence with exactly fifteen words in total for testing purposes'
});
console.log(result);
```

## Project Files

- `main.py` - FastAPI application with /summaries endpoint
- `middleware.py` - Custom logging middleware
- `test_main.py` - Pytest test suite
- `summaryClient.ts` - TypeScript client library
- `test_client.ts` - Example usage of TypeScript client
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies
- `tsconfig.json` - TypeScript configuration
- `README.md` - Full documentation
