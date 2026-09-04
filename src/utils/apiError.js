// Custom error type for predictable API error responses.
class ApiError extends Error {
    // Accepts the HTTP status, message, optional detailed errors, and optional stack trace.
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // Initializes the built-in Error class with the main message.
        super(message);
        // Stores the HTTP status that a central error middleware can send.
        this.statusCode = statusCode;
        // Keeps the response data empty because this represents a failure.
        this.data = null;
        // Stores the public-facing error message.
        this.message = message;
        // Marks this response as unsuccessful.
        this.success = false;
        // Stores validation or field-level errors, if any.
        this.errors = errors;

        if (stack) {
            // Uses a supplied stack trace when one is available.
            this.stack = stack;
        } else {
            // Creates a stack trace that starts at the caller of this constructor.
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Makes ApiError importable by controllers and error middleware.
export { ApiError };