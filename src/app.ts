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
import * as leaderboardController from './controllers/leaderboard';
import * as donationController from './controllers/donation';

// Create Express server
const app = express();

// Domain Whitelist
const whitelist = [
    'http://localhost:8080',
    'https://riceshare.com'
];

// Cross-Origin Resource Sharing Options
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (origin && whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // callback(new Error('Not allowed by CORS'));
            callback(null, true);
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
app.get('/answers/count', answerController.getCount);
app.get('/answers/count/username', answerController.getCountUsername);
app.post('/answers', answerController.post);
app.put('/answers', answerController.put);
app.delete('/answers', answerController.remove);

app.get('/categories', categoryController.get);
app.post('/categories', categoryController.post);
app.put('/categories', categoryController.put);
app.delete('/categories', categoryController.remove);

app.get('/users', userController.get);
app.get('/users/count', userController.getCount);
app.post('/users', userController.post);
app.put('/users', userController.put);
app.delete('/users', userController.remove);

app.post('/auth/login', authenticationController.login);
app.post('/auth/register', authenticationController.register);
app.post('/auth/validate', authenticationController.validate);
app.post('/auth/logout', authenticationController.logout);

app.get('/quiz', quizController.get);
app.post('/quiz', quizController.post);

app.get('/leaderboard', leaderboardController.get);

app.get('/donation', donationController.get);
app.get('/donation/total', donationController.getTotal);
app.post('/donation', donationController.post);

export default app;

module.exports = app;
