import {Request, Response} from "express";
import {Question} from "../models/question";
import {connection} from '../util/database';

/**
 * GET /questions/
 * GET /questions?categoryName={name}
 * Retrieve all questions from database
 */
export const get = (req: Request, res: Response) => {
    let sqlQuery = `
    SELECT 
        question_id,
        question,
        correct_answer,
        incorrect_answer_1,
        incorrect_answer_2,
        incorrect_answer_3,
        deleted,
        category_name
    FROM question, category
    WHERE question.deleted != 1
    `;
    const categoryName = req.query.categoryName;
    if (categoryName != undefined) {
        sqlQuery = `
        SELECT 
            question_id,
            question,
            correct_answer,
            incorrect_answer_1,
            incorrect_answer_2,
            incorrect_answer_3,
            deleted,
            category_name
        FROM question, category
        WHERE category.category_name = '${categoryName}'
        AND question.deleted != 1
        `;
    }
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            const questions: Question[] = [];
            for (let i = 0; i < results.length; i++) {
                const question: Question = {
                    id: results[i].question_id,
                    question: results[i].question,
                    correctAnswer: results[i].correct_answer,
                    incorrectAnswer1: results[i].incorrect_answer_1,
                    incorrectAnswer2: results[i].incorrect_answer_2,
                    incorrectAnswer3: results[i].incorrect_answer_3,
                    category: results[i].category_name
                };
                questions.push(question);
            }
            res.status(200).json(questions);
        }
    });
};

/**
 * POST /questions/
 * Inserts a question record into database
 */
export const post = (req: Request, res: Response) => {
    const question: Question = req.body;
    const sqlQuery = `
    INSERT INTO question(
        question,
        correct_answer,
        incorrect_answer_1,
        incorrect_answer_2,
        incorrect_answer_3,
        category_id
    ) VALUES (
        '${question.question}',
        '${question.correctAnswer}',
        '${question.incorrectAnswer1}',
        '${question.incorrectAnswer2}',
        '${question.incorrectAnswer3}',
        (SELECT category_id
         FROM category
         WHERE category_name = '${question.category}'));
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    })
};

/**
 * PUT /questions/
 * Update a question record in database with the following id
 */
export const put = (req: Request, res: Response) => {
    const question: Question = req.body;
    const sqlQuery = `
        UPDATE question
        SET question = "${question.question}", 
        correct_answer = "${question.correctAnswer}", 
        incorrect_answer_1 = "${question.incorrectAnswer1}", 
        incorrect_answer_2 = "${question.incorrectAnswer2}", 
        incorrect_answer_3 = "${question.incorrectAnswer3}", 
        category_id = (SELECT category_id 
                       FROM category 
                       WHERE category_name = "${question.category}")
        WHERE question_id = ${question.id};
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};

/**
 * DELETE /questions/
 * Mark a question record as deleted in database with the following id
 */
export const remove = (req: Request, res: Response) => {
    const questionId = req.query.questionId;
    const sqlQuery = `
    UPDATE question
    SET deleted = 1
    WHERE question_id = ${questionId};
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    })
};