// Standard shape for successful API responses.
class ApiResponse {
    // Receives the HTTP status, returned data, and an optional human-readable message.
    constructor(statusCode, data, message = "Success") {
        // Stores the status code so the controller can use it in res.status(...).
        this.statusCode = statusCode;
        // Stores the actual payload returned to the client.
        this.data = data;
        // Stores a short explanation of the result.
        this.message = message;
        // Status codes below 400 represent success in this project.
        this.success = statusCode < 400;
    }
}

// Makes ApiResponse importable by controllers and routes.
export { ApiResponse };