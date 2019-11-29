import {Request, Response} from 'express';
import {Question} from '../models/question';
import {
    deleteQuestion,
    insertQuestion,
    selectQuestion,
    updateQuestion,
    updateQuestionDeleted
} from '../database/questions';

/**
 * GET /questions?page=1&deleted={false}
 * GET /questions?page=1&deleted={false}&id={id}
 * GET /questions?page=1&deleted={false}&category={name}
 * Retrieve all questions from database
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page != undefined ? parseInt(req.query.page) : undefined;
    const questionId: number = req.query.id != undefined ? parseInt(req.query.id) : undefined;
    const categoryName: string = req.query.category;
    const deleted: boolean = req.query.deleted == 'true' || categoryName != undefined || questionId != undefined;
    selectQuestion(page, deleted, questionId, categoryName).then((success) => {
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
    insertQuestion(question).then((success) => {
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
    updateQuestion(question).then((success) => {
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
    updateQuestionDeleted(questionId).then((success) => {
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
