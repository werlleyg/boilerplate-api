import { Router } from "express";

/*
  Routes

  Import routes, for example: usersROutes and AuthenticateRoutes below
*/

import { usersRoutes } from "./usersRoutes";
import { authenticateRoutes } from "./authenticateRoutes";

// Create router
const routes = Router();

/*
  Use routers
  
  Use routes, for example: '/users' and '/session' below
*/
routes.use("/users", usersRoutes);
routes.use("/session", authenticateRoutes);

export { routes };
