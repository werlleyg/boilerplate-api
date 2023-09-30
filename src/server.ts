// To simplify error handling on asynchronous routes and middleware in Express
import "express-async-errors";
import express from "express";
// Routes
import { routes } from "./routes";
// Interceptors
import { errorInterceptor } from "./errors/errorInterceptor";
// config
import { APP_PORT } from "../configs";

// Create express app
const app = express();

// Parse JSON
app.use(express.json());
// Use routes in app
app.use(routes);
// Use interceptors in app
app.use(errorInterceptor);
//  Start API
app.listen(APP_PORT, () => {
  console.log(`[Server started on port ${APP_PORT}]`);
});
