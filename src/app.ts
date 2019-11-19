import express from "express";
import compression from "compression";
import bodyParser from "body-parser";

import { PORT, API_KEY } from "./util/secrets";

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as questionController from "./controllers/question";
import * as answerController from "./controllers/answers";
import * as categoryController from "./controllers/categories";
import * as userController from "./controllers/users";

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

app.get("/answers", answerController.get);
app.post("/answers", answerController.post);
app.put("/answers", answerController.put);
app.delete("/answers", answerController.remove);

app.get("/categories", categoryController.get);
app.post("/categories", categoryController.post);
app.put("/categories", categoryController.put);

app.get('/users', userController.get);
app.post('/users', userController.post);
app.put('/users', userController.put);


export default app;
