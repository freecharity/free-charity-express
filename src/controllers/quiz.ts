import {Request, Response} from 'express';
import {Question} from '../models/question';
import {getQuestions, postAnswer} from '../database/quiz';
import {Answer} from '../models/answer';

/**
 * GET /quiz/
 * Retrieves questions by category
 */
export const get = (req: Request, res: Response) => {
    const categoryName = req.query.categoryName;
    getQuestions(categoryName).then((questions: Question[]) => {
        res.status(200).send(questions);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

/**
 * POST /quiz/
 * Inserts an answer record into the database
 */
export const post = (req: Request, res: Response) => {
    const answer: Answer = req.body.answer;
    postAnswer(answer).then((answer: Answer) => {
        res.status(200).send(answer);
    }).catch((error) => {
        res.status(400).send(error);
    });
};
