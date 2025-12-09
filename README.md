# Virtual Sapiens Demo - Text Summarization API

A professional FastAPI application with a TypeScript client for extracting the first 10 words from text input with timestamp tracking.

## Features

- **FastAPI Backend**: RESTful API with input validation and error handling
- **Custom Middleware**: Request logging with execution time tracking
- **TypeScript Client**: Type-safe client with proper error handling
- **Comprehensive Tests**: Pytest test suite covering edge cases
- **Production-Ready**: Error handling, validation, logging, and documentation

## Project Structure

```
.
├── main.py              # FastAPI application with /summaries endpoint
├── middleware.py        # Custom logging middleware
├── test_main.py         # Pytest test suite
├── summaryClient.ts     # TypeScript client library
├── requirements.txt     # Python dependencies
├── package.json         # Node.js/TypeScript configuration
├── tsconfig.json        # TypeScript compiler configuration
└── README.md           # This file
```

## Setup

### Backend (Python/FastAPI)

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

4. **View API documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend (TypeScript Client)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Type check**:
   ```bash
   npm run type-check
   ```

3. **Build** (optional):
   ```bash
   npm run build
   ```

## Usage

### API Endpoint

**POST /summaries**

Request:
```json
{
  "text": "This is a sample text with more than ten words that will be summarized to show only the first ten words"
}
```

Response:
```json
{
  "summary": "This is a sample text with more than ten words that",
  "timestamp": "2024-01-15T10:30:45.123456+00:00",
  "word_count": 10
}
```

### TypeScript Client

```typescript
import { createSummary, SummaryRequest } from './summaryClient';

async function example() {
  try {
    const response = await createSummary('http://localhost:8000', {
      text: 'This is a long text with many words that will be summarized'
    });
    
    console.log('Summary:', response.summary);
    console.log('Word Count:', response.wordCount);
    console.log('Timestamp:', response.timestamp);
  } catch (error) {
    if (error instanceof SummaryApiError) {
      console.error('API Error:', error.message, error.statusCode);
    } else {
      console.error('Error:', error);
    }
  }
}
```

## Testing

### Backend Tests

Run the pytest test suite:

```bash
pytest test_main.py -v
```

Tests cover:
- Exact 10-word extraction
- Timestamp presence and validity
- Edge cases (empty text, whitespace, etc.)
- Error handling

### TypeScript Type Checking

```bash
npm run type-check
```

## Middleware

The custom `LoggingMiddleware` logs:
- **Request Path**: The URL path of the incoming request
- **Execution Time**: Time taken to process the request (in milliseconds)
- **Status Code**: HTTP status code of the response

Example log output:
```
[LOG] Path: /summaries | Execution Time: 2.45ms | Status: 200
```

## API Endpoints

- `GET /` - Health check and service info
- `GET /health` - Health check endpoint
- `POST /summaries` - Create a summary from text input

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `422` - Validation error (empty text, invalid input)
- `500` - Internal server error

The TypeScript client throws `SummaryApiError` for non-2xx responses with detailed error messages.

## Production Considerations

This implementation includes:
- ✅ Input validation with Pydantic
- ✅ Error handling and appropriate HTTP status codes
- ✅ Request logging middleware
- ✅ Type safety in TypeScript client
- ✅ Comprehensive test coverage
- ✅ API documentation (Swagger/ReDoc)

**Potential improvements for production**:
- Structured logging (e.g., JSON logs to CloudWatch/DataDog)
- Rate limiting
- Authentication/Authorization
- Request/response caching
- Metrics and monitoring (Prometheus, etc.)
- Database persistence for summaries
- Async task queue for heavy processing
- API versioning
- Request ID tracking for distributed tracing

## License

MIT

