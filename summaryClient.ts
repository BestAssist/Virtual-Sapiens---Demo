/**
 * TypeScript client for the Text Summarization API.
 * 
 * This module provides a type-safe client for calling the FastAPI
 * /summaries endpoint with proper error handling and type checking.
 */

/**
 * Request payload for creating a summary.
 */
export interface SummaryRequest {
  text: string;
}

/**
 * Response from the summary endpoint.
 * Includes the summary text, UTC timestamp, and word count.
 */
export interface SummaryResponse {
  summary: string;
  timestamp: string;
  wordCount: number;
}

/**
 * Custom error class for API errors.
 */
export class SummaryApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "SummaryApiError";
  }
}

/**
 * Counts the number of words in a string by splitting on whitespace.
 * 
 * @param text - The text to count words in
 * @returns The number of words (non-empty strings after splitting)
 */
function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }
  return text.trim().split(/\s+/).length;
}

/**
 * Creates a summary by calling the FastAPI /summaries endpoint.
 * 
 * This function:
 * 1. Sends a POST request to {baseUrl}/summaries
 * 2. Validates the response status code
 * 3. Computes wordCount from the summary on the client side
 * 4. Returns a typed SummaryResponse
 * 
 * @param baseUrl - The base URL of the FastAPI server (e.g., "http://localhost:8000")
 * @param payload - The SummaryRequest containing the text to summarize
 * @returns A Promise that resolves to a SummaryResponse
 * @throws SummaryApiError if the response status is not 2xx
 * @throws Error for network errors or invalid responses
 * 
 * @example
 * ```typescript
 * const response = await createSummary("http://localhost:8000", {
 *   text: "This is a long text with many words that will be summarized"
 * });
 * console.log(response.summary); // First 10 words
 * console.log(response.wordCount); // 10
 * console.log(response.timestamp); // ISO timestamp
 * ```
 */
export async function createSummary(
  baseUrl: string,
  payload: SummaryRequest
): Promise<SummaryResponse> {
  // Validate input
  if (!payload.text || typeof payload.text !== "string") {
    throw new Error("Payload must contain a non-empty text string");
  }

  if (!baseUrl || typeof baseUrl !== "string") {
    throw new Error("baseUrl must be a non-empty string");
  }

  // Construct the full URL
  const url = `${baseUrl.replace(/\/$/, "")}/summaries`;

  try {
    // Make the POST request using fetch
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if response status is not 2xx
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      let errorData: unknown;

      try {
        errorData = await response.json();
        if (errorData && typeof errorData === "object" && "detail" in errorData) {
          errorMessage = String(errorData.detail);
        }
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new SummaryApiError(errorMessage, response.status, errorData);
    }

    // Parse the JSON response
    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format: expected an object");
    }

    if (typeof data.summary !== "string") {
      throw new Error("Invalid response format: summary must be a string");
    }

    if (typeof data.timestamp !== "string") {
      throw new Error("Invalid response format: timestamp must be a string");
    }

    // Compute wordCount on the client from summary
    // This ensures consistency and allows client-side validation
    const wordCount = countWords(data.summary);

    // Return typed response
    return {
      summary: data.summary,
      timestamp: data.timestamp,
      wordCount: wordCount,
    };
  } catch (error) {
    // Re-throw SummaryApiError as-is
    if (error instanceof SummaryApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Network error: Unable to connect to ${url}. Please check if the server is running.`
      );
    }

    // Re-throw other errors
    throw error;
  }
}

