import express from "express";
import compression from "compression";
import bodyParser from "body-parser";

import { PORT, API_KEY } from "./util/secrets";

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as questionController from "./controllers/question";

// Create Express server
const app = express();

// Express configuration
app.set("port", PORT);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Server routes.
 */
app.get("/questions", questionController.get);
app.post("/questions", questionController.post);
app.put("/questions", questionController.put);
app.delete("/questions", questionController.remove);

export default app;
