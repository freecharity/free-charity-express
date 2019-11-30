import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors, {CorsOptions} from 'cors';

import {PORT} from './util/secrets';

import * as questionController from './controllers/questions';
import * as answerController from './controllers/answers';
import * as categoryController from './controllers/categories';
import * as userController from './controllers/users';
import * as quizController from './controllers/quiz';
import * as authenticationController from './controllers/auth';

// Create Express server
const app = express();

// Domain Whitelist
const whitelist = [
    'http://localhost:8080'
];

// Cross-Origin Resource Sharing Options
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
};

// Express configuration
app.set('port', PORT);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));

// Server Routes
app.get('/questions', questionController.get);
app.post('/questions', questionController.post);
app.put('/questions', questionController.put);
app.delete('/questions', questionController.remove);

app.get('/answers', answerController.get);
app.post('/answers', answerController.post);
app.put('/answers', answerController.put);
app.delete('/answers', answerController.remove);

app.get('/categories', categoryController.get);
app.post('/categories', categoryController.post);
app.put('/categories', categoryController.put);
app.delete('/categories', categoryController.remove);

app.get('/users', userController.get);
app.post('/users', userController.post);
app.put('/users', userController.put);
app.delete('/users', userController.remove);

app.post('/auth/login', authenticationController.login);
app.post('/auth/register', authenticationController.register);
app.post('/auth/validate', authenticationController.validate);
app.post('/auth/logout', authenticationController.logout);

// TODO: Add Quiz Tests
app.get('/quiz', quizController.get);
app.post('/quiz', quizController.post);

// TODO: Add Leaderboard Tests


export default app;

module.exports = app;
