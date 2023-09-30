import { Request, Response } from "express";
// prisma
import { prisma } from "../lib/prisma";
// types
import { IRole } from "./../dtos/users";
// Errors
import { AppError } from "../errors/AppError";
// Zod
import Zod from "zod";
// Encrypt
import { hash } from "bcrypt";
// Utils
import { excludeFields } from "../utils/excludeFields";

/**
 * Controller class responsible for handling user-related HTTP requests.
 */
export class UsersController {
  /**
   * List all users.
   * @param {Request} _request - The Express request object (not used in this method).
   * @param {Response} response - The Express response object to send the user list as JSON.
   */
  public async list(_request: Request, response: Response) {
    // Fetch all users from the database.
    const users = await prisma.user.findMany();

    // Exclude sensitive fields (e.g., password_hash) and send the user list as JSON response.
    const usersWithoutPassword = users.map((user) =>
      excludeFields(user, ["password_hash"]),
    );

    return response.status(200).json(usersWithoutPassword);
  }

  /**
   * Show details of one user by ID.
   * @param {Request} request - The Express request object containing user ID as a parameter.
   * @param {Response} response - The Express response object to send user details as JSON.
   */
  public async show(request: Request, response: Response) {
    // Extract user ID from the request parameters.
    const { id } = request.params;

    // Fetch the user from the database based on the provided ID.
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // If the user does not exist, throw a 404 error.
    if (!user) throw new AppError("User not found", 404);

    // Exclude sensitive fields (e.g., password_hash) and send user details as JSON response.
    const userWithoutPassword = excludeFields(user, ["password_hash"]);

    return response.status(200).json(userWithoutPassword);
  }

  /**
   * Create a new user.
   * @param {Request} request - The Express request object containing user data in the request body.
   * @param {Response} response - The Express response object to send the newly created user as JSON.
   */
  public async create(request: Request, response: Response) {
    // Define a schema for validating and parsing the request body.
    const bodySchema = Zod.object({
      // Specify the expected shape of user data and validation rules.
      name: Zod.string().min(3),
      email: Zod.string().email(),
      password: Zod.string().min(6),
      password_confirmation: Zod.string().min(6),
      is_admin: Zod.boolean().nullish(),
    })
      .strict()
      .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ["password_confirmation"],
      });

    // Parse and validate user data from the request body.
    const { name, email, password, is_admin } = bodySchema.parse(request.body);

    // Check if the user with the provided email already exists in the database.
    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    // If the user already exists, throw a 409 (Conflict) error.
    if (userExists) throw new AppError("User already registered", 409);

    // Hash the user's password for security.
    const password_hash = await hash(password, 6);

    // Determine the user's role (e.g., 'admin' or 'guest') based on 'is_admin' field.
    const role: IRole = is_admin ? "admin" : "guest";

    // Create a new user in the database.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role,
      },
    });

    // Exclude sensitive fields (e.g., password_hash) and send the newly created user as JSON response.
    const userWithoutPassword = excludeFields(user, ["password_hash"]);

    return response.status(200).json(userWithoutPassword);
  }

  /**
   * Update an existing user's details.
   * @param {Request} request - The Express request object containing user data to update in the request body.
   * @param {Response} response - The Express response object to send the updated user details as JSON.
   */
  public async update(request: Request, response: Response) {
    // Define a schema for validating and parsing the request body for updates.
    const bodySchema = Zod.object({
      name: Zod.string().min(3).nullish(),
      email: Zod.string().email().nullish(),
      is_admin: Zod.boolean().nullish(),
    }).strict();

    // Parse and validate user update data from the request body.
    const { name, email, is_admin } = bodySchema.parse(request.body);

    // Extract user ID from the request parameters.
    const { id } = request.params;

    // Check if the user with the provided ID exists in the database.
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    // If the user does not exist, throw a 404 error.
    if (!userExists) throw new AppError("User not found", 404);

    // Determine the user's new role based on 'is_admin' field or maintain the existing role if not provided.
    let role: IRole;
    if (is_admin === undefined && userExists.role === "admin") {
      role = userExists.role;
    } else {
      role = is_admin === true ? "admin" : "guest";
    }

    // Update user data based on provided fields.
    let data = { ...userExists };
    if (name) data = { ...data, name };
    if (email) data = { ...data, email };
    if (role) data = { ...data, role };

    // Update the user in the database.
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    // Exclude sensitive fields (e.g., password_hash) and send the updated user details as JSON response.
    const userWithoutPassword = excludeFields(user, ["password_hash"]);

    return response.status(200).json(userWithoutPassword);
  }

  /**
   * Delete a user by ID.
   * @param {Request} request - The Express request object containing user ID as a parameter.
   * @param {Response} response - The Express response object to send a success response (204 - No Content).
   */
  public async delete(request: Request, response: Response) {
    // Extract user ID from the request parameters.
    const { id } = request.params;

    // Fetch the user from the database based on the provided ID.
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // If the user does not exist, throw a 404 error.
    if (!user) throw new AppError("User not found", 404);

    // Delete the user from the database.
    await prisma.user.delete({
      where: {
        id,
      },
    });

    if (!user) throw new AppError("User not found", 404);

    // Respond with a 204 (No Content) status to indicate successful deletion.
    return response.status(204).json({});
  }
}
