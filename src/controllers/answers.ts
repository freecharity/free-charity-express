import {Request, Response} from 'express';
import {Answer} from '../models/answer';
import {connection} from '../util/database';
import {deleteAnswer, insertAnswer, selectAnswer, updateAnswer} from '../database/answers';

/**
 * GET /answers?page={1}&deleted={0}&correct={0}
 * GET /answers?page={1}&deleted={0}&correct={0}&username={'jason'}
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page != undefined ? parseInt(req.query.page) : undefined;
    const deleted: number = req.query.deleted != undefined ? parseInt(req.query.deleted) : undefined;
    const correct: number = req.query.correct != undefined ? parseInt(req.query.correct) : undefined;
    const username: string = req.query.username;
    selectAnswer(page, deleted, correct, username).then((success) => {
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
 * Update an answer record with the following id
 */
export const remove = (req: Request, res: Response) => {
    const answerId = req.query.answerId;
    const sqlQuery = `
    UPDATE answer
    SET deleted = 1
    WHERE answer_id = ${answerId};
  `;
    connection.query(sqlQuery, (error, results) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    });
};

export const deleteForce = (req: Request, res: Response) => {
    const answerId = req.query.answerId;
    deleteAnswer(answerId).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
