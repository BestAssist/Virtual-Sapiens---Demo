"""
Custom middleware for request logging.

This middleware logs request path, execution time, and status code
for all incoming requests to the FastAPI application.
"""

import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that logs request path, execution time, and status code.

    This middleware:
    1. Captures the request path
    2. Records the start time before processing
    3. Calls the next middleware/handler
    4. Calculates execution time
    5. Logs path, execution time, and status code
    """

    def __init__(self, app: ASGIApp):
        """
        Initialize the logging middleware.

        Args:
            app: The ASGI application to wrap
        """
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process the request and log metrics.

        This method:
        1. Extracts the request path
        2. Records start time
        3. Calls the next middleware/handler via call_next
        4. Calculates execution time
        5. Logs the metrics

        Args:
            request: The incoming HTTP request
            call_next: Function to call the next middleware/handler

        Returns:
            The HTTP response from the application
        """
        # Extract request path
        request_path = request.url.path

        # Record start time before processing
        start_time = time.time()

        # Call the next middleware or route handler
        # This is where FastAPI processes the request and generates the response
        response = await call_next(request)

        # Calculate execution time in milliseconds
        execution_time_ms = (time.time() - start_time) * 1000

        # Extract status code from response
        status_code = response.status_code

        # Log the metrics
        # In production, you might want to use a proper logging library
        # and send this to a monitoring service
        print(
            f"[LOG] Path: {request_path} | "
            f"Execution Time: {execution_time_ms:.2f}ms | "
            f"Status: {status_code}"
        )

        return response

