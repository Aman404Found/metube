// Converts an async route handler into Express middleware that forwards failures.
const asyncHandler = (requestHandler) => {
    // Return the wrapper: Express needs this function to receive req, res, and next.
    return (req, res, next) => {
        // Promise.resolve also handles handlers that return a normal value.
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}


export { asyncHandler };

/*
method 2
const asyncHandlerTryCatch = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message,
        });
    }
};

export { asyncHandlerTryCatch };
*/