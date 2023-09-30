import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
// App error
import { AppError } from "./AppError";

/**
 * Error handling middleware function that intercepts and processes errors.
 *
 * @param {Error} error - The error object being handled.
 * @param {Request} request - The Express request object. [Not used yet]
 * @param {Response} response - The Express response object.
 * @param {NextFunction} next - The Express next function to pass control to the next middleware. [Not used yet]
 */
export function errorInterceptor(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // Handle errors of type 'AppError' (custom application-specific errors).
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      status: "Error",
      message: error.message,
    });
  }

  // Handle errors of type 'ZodError' (validation errors).
  if (error instanceof ZodError) {
    response.status(400).json({
      status: "Validation error",
      message: error.issues,
    });
  }

  // Handle all other unhandled errors with a generic 500 (Internal Server Error) response.
  return response.status(500).json({
    status: "Error",
    message: "Internal Server Error",
  });
}
