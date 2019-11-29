import {Request, Response} from 'express';
import {Question} from '../models/question';
import {deleteQuestion, insert, markDeleted, select, update} from '../database/questions';

/**
 * GET /questions?page=1&deleted={false}
 * GET /questions?page=1&deleted={false}&id={id}
 * GET /questions?page=1&deleted={false}&category={name}
 * Retrieve all questions from database
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page;
    const questionId: number = req.query.id;
    const category: string = req.query.category;
    const deleted: boolean = req.query.deleted == 'true' || category != undefined || questionId != undefined;
    select(page, deleted, questionId, category).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * POST /questions/
 * Inserts a question record into database
 */
export const post = (req: Request, res: Response) => {
    const question: Question = req.body;
    insert(question).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * PUT /questions/
 * Update a question record in database with the following id
 */
export const put = (req: Request, res: Response) => {
    const question: Question = req.body;
    update(question).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * DELETE /questions?questionId=3
 * Mark a question record as deleted in database with the following id
 */
export const remove = (req: Request, res: Response) => {
    const questionId = req.query.id;
    markDeleted(questionId).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

export const deleteForce = (req: Request, res: Response) => {
    const questionId = req.query.id;
    deleteQuestion(questionId).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
