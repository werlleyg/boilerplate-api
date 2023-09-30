import { Router } from "express";

// Controlles
/*
  Import controllers, for example: Authenticate Controller below
*/
import { AuthenticateController } from "../controllers/AuthenticateController";

// Create authenticateRoutes const
const authenticateRoutes = Router();

// New scope controller
/*
  Declare a new scope controller, for example: new Athenticate Controller below
*/
const controller = new AuthenticateController();

// Public routes
/*
  Declare the public routes, for example: Authenticate Router post below
*/
authenticateRoutes.post("/", controller.create);

export { authenticateRoutes };
