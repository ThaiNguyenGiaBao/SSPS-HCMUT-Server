class ErrorResponse extends Error {
    status: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.status = statusCode;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message: string) {
        super(message, 400);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message: string) {
        super(message, 401);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message: string) {
        super(message, 404);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message: string) {
        super(message, 403);
    }
}

export { ErrorResponse, BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError };
