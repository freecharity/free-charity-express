import {Request, Response} from 'express';
import {Answer} from '../models/answer';
import {deleteAnswers, insertAnswer, selectAnswer, updateAnswer} from '../database/answers';

/**
 * GET /answers/
 * Retrieve answers from database
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page != undefined ? parseInt(req.query.page) : undefined;
    const correct: number = req.query.correct != undefined ? parseInt(req.query.correct) : undefined;
    const username: string = req.query.username;
    selectAnswer(page, correct, username).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * POST /answers/
 * Insert an answer record into database
 */
export const post = (req: Request, res: Response) => {
    const answer: Answer = req.body;
    insertAnswer(answer).then(success => {
        res.status(200).send(success);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

/**
 * PUT /answers/
 * Update an answer record with the following id
 */
export const put = (req: Request, res: Response) => {
    const answer: Answer = req.body;
    updateAnswer(answer).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

/**
 * DELETE /answers/
 * Delete records by id from database
 */
export const remove = (req: Request, res: Response) => {
    const answerIds = req.query.ids;
    deleteAnswers(answerIds).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    })
};
