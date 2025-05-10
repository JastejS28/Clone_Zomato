class ErrorHandler extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack) {
        super(message); // Create the parent first
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.message = message;
        this.success = false;
    }
}

export default ErrorHandler;