import { Request, Response } from "express";
// Prisma
import { prisma } from "../lib/prisma";
// Errors
import { AppError } from "../errors/AppError";
// Zod
import Zod from "zod";
// Encrypt
import { compare } from "bcrypt";
// Utils
import { excludeFields } from "../utils/excludeFields";
// Sign
import { sign } from "jsonwebtoken";
// Process
import process from "process";

/**
 * Controller class responsible for user authentication.
 */
export class AuthenticateController {
  /**
   * Authenticate a user by checking email and password.
   * @param {Request} request - The Express request object containing user credentials in the request body.
   * @param {Response} response - The Express response object to send authentication result as JSON.
   */
  public async create(request: Request, response: Response) {
    // Define a schema for validating and parsing the request body.
    const bodySchema = Zod.object({
      email: Zod.string().email(),
      password: Zod.string().min(6),
    }).strict();

    // Parse and validate user credentials from the request body.
    const { email, password } = bodySchema.parse(request.body);

    // Find a user in the database based on the provided email.
    const user = await prisma.user.findFirst({
      where: { email },
    });

    // If no user is found with the provided email, throw a 401 (Unauthorized) error.
    if (!user) throw new AppError("Incorrect Email or Password", 401);

    // Compare the provided password with the hashed password in the database.
    const passwordMatch = await compare(password, user.password_hash);

    // If passwords don't match, throw a 401 (Unauthorized) error.
    if (!passwordMatch) throw new AppError("Incorrect Email or Password", 401);

    // Generate a JWT token for authentication.
    const token = sign({}, process.env.SECRET_KEY as string, {
      subject: user.id,
      expiresIn: "1d",
    });

    // Exclude sensitive fields (e.g., password_hash) and send the token and user details as JSON response.
    const userWithoutPassword = excludeFields(user, ["password_hash"]);

    return response.status(200).json({ token, ...userWithoutPassword });
  }
}
