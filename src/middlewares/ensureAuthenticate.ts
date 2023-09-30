import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import process from "process";

// Errors
import { AppError } from "../errors/AppError";

/**
 * Middleware function to ensure authentication by verifying a JWT token.
 *
 * @param {Request} request - The Express request object.
 * @param {Response} response - The Express response object.
 * @param {NextFunction} next - The Express next function to pass control to the next middleware.
 * @throws {AppError} If the token is missing or invalid, it will throw an AppError with status code 401.
 */
export function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // Extract the JWT token from the request headers
  const authHeader = request.headers.authorization;

  // Check if the token is missing
  if (!authHeader)
    return response.status(401).json({ message: "Token required" });

  // Split the token from the 'Bearer' keyword
  const [_, token] = authHeader.split(" ");

  try {
    // Verify the token's authenticity using the provided SECRET_KEY
    const { sub } = verify(token, process.env.SECRET_KEY as string);

    // Attach the user ID to the request for subsequent middleware to access
    request.userId = sub as string;

    // Continue to the next middleware
    next();
  } catch (error) {
    // If the token is invalid, throw an AppError with status code 401
    throw new AppError("Token invalid", 401);
  }
}
