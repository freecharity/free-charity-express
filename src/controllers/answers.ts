import {Request, Response} from 'express';
import {Answer} from '../models/answer';
import {
    deleteAnswers,
    insertAnswer,
    selectAnswer,
    selectAnswerCount,
    selectAnswerCountByUser,
    updateAnswer
} from '../database/answers';

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
 * GET /answers/count/
 * Retrieves number of answers from database
 */
export const getCount = (req: Request, res: Response) => {
    const correct: number = req.query.correct != undefined ? parseInt(req.query.correct) : undefined;
    selectAnswerCount(correct).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * GET /answers/count/username
 * Retrieves number of answers from database
 */
export const getCountUsername = (req: Request, res: Response) => {
    const correct: number = req.query.correct != undefined ? parseInt(req.query.correct) : undefined;
    const username: string = req.query.username;
    selectAnswerCountByUser(correct, username).then((response) => {
        res.status(200).json(response);
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
    insertAnswer(answer).then(response => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * PUT /answers/
 * Update an answer record with the following id
 */
export const put = (req: Request, res: Response) => {
    const answer: Answer = req.body;
    updateAnswer(answer).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * DELETE /answers/
 * Delete records by id from database
 */
export const remove = (req: Request, res: Response) => {
    const answerIds = req.query.ids;
    deleteAnswers(answerIds).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    })
};
