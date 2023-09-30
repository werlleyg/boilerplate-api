import { Router } from "express";

/*
  Controlles

  Import controllers, for example: 'UserController' below
*/
import { UsersController } from "../controllers/UsersController";

/*
  Middlewares

  Import middlewares, for example: Ensure Authenticate below
*/
import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

// Create userRoutes const
const usersRoutes = Router();

/*
  New scope controller

  Declare a new scope controller, for example: UserController below
*/
const controller = new UsersController();

/*
  Public routes

  Declare the public routes, for example: '/create' router shown below
*/
usersRoutes.post("/create", controller.create);

// Private routes
usersRoutes.use(ensureAuthenticate);
/*
  Declare the private routes, for example: '/' to list, ':id' to show, and others, as shown below 
*/
usersRoutes.get("/", controller.list);
usersRoutes.get("/:id", controller.show);
usersRoutes.put("/update/:id", controller.update);
usersRoutes.delete("/delete/:id", controller.delete);

export { usersRoutes };
