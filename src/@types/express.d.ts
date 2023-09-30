/**
 * Declaration to extend the Express.js Request interface.
 * It adds a new property 'userId' to the Request object.
 * This allows developers to access and set the user's ID in request objects.
 */
declare namespace Express {
  export interface Request {
    userId: string;
  }
}
