// Typed application errors. Throw these from anywhere; the global onError
// handler (app.ts) maps them to the standard error envelope + status code.
// `expose: false` means the message is hidden from clients (generic 5xx text).

export class AppError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly expose: boolean

  constructor(statusCode: number, code: string, message: string, expose = true) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.expose = expose
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, 'BAD_REQUEST', message)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, 'FORBIDDEN', message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(404, 'NOT_FOUND', message)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, 'CONFLICT', message)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(422, 'VALIDATION', message)
  }
}

// For calls to internal/upstream services (see docs/ARCHITECTURE.md → Escape hatches).
export class BadGatewayError extends AppError {
  constructor(message = 'Upstream service error') {
    super(502, 'BAD_GATEWAY', message, false)
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(503, 'SERVICE_UNAVAILABLE', message, false)
  }
}
