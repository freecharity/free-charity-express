import {Request, Response} from 'express';
import {Question} from '../models/question';
import {deleteQuestion, insertQuestion, selectQuestion, updateQuestion} from '../database/questions';

/**
 * GET /questions/
 * Retrieve questions from the database
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page != undefined ? parseInt(req.query.page) : undefined;
    const questionId: number = req.query.id != undefined ? parseInt(req.query.id) : undefined;
    const categoryName: string = req.query.category;
    selectQuestion(page, questionId, categoryName).then((success) => {
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
 * Update a question by id in the database
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
 * DELETE /question/
 * Delete questions by id from the database
 */
export const remove = (req: Request, res: Response) => {
    const questionIds: string[] = req.query.ids;
    deleteQuestion(questionIds).then((success) => {
        res.status(200).json(success);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
