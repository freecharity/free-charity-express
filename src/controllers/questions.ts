import {Request, Response} from 'express';
import {Question} from '../models/question';
import {connection} from '../util/database';

/**
 * GET /questions?page=1&deleted=false
 * GET /questions?page=1&deleted=false&id={id}
 * GET /questions?page=1&deleted=false&category={name}
 * Retrieve all questions from database
 */
export const get = (req: Request, res: Response) => {
    const page = req.query.page;
    const questionId = req.query.id;
    const categoryName = req.query.category;
    const showDeleted = req.query.deleted == 'true'
        || categoryName != undefined
        || questionId != undefined;
    let sqlQuery = `
    SELECT \`question_id\`,
        \`question\`,
        \`answer\`,
        \`incorrect_1\`,
        \`incorrect_2\`,
        \`incorrect_3\`,
        question.deleted,
        question.category_id,
        (SELECT category.name
         FROM category
         WHERE category.category_id = question.category_id)
         AS category_name
    FROM question
    WHERE question.deleted != ${showDeleted ? -1 : 1}
    ${questionId != undefined ? `AND question_id = ${questionId}` : ''}
    ${categoryName != undefined ? `AND category.name = ${categoryName}` : ''}
    ;`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            const questions: Question[] = [];
            for (let i = 0; i < results.length; i++) {
                const question: Question = {
                    question_id: results[i].question_id,
                    question: results[i].question,
                    answer: results[i].answer,
                    deleted: results[i].deleted,
                    incorrect_1: results[i].incorrect_1,
                    incorrect_2: results[i].incorrect_2,
                    incorrect_3: results[i].incorrect_3,
                    category_id: results[i].category_id,
                    category_name: results[i].category_name
                };
                questions.push(question);
            }
            const startIndex = (page - 1) * 10;
            const endIndex = (page * 10) - 1;
            res.status(200).send({
                page: page,
                total: questions.length,
                results: questions.splice(startIndex, 10)
            });
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
        \`question\`,
        \`answer\`,
        \`deleted\`,
        \`incorrect_1\`,
        \`incorrect_2\`,
        \`incorrect_3\`,
        \`category_id\`
    ) VALUES (
        '${question.question}',
        '${question.answer}',
        '${question.deleted}',
        '${question.incorrect_1}',
        '${question.incorrect_2}',
        '${question.incorrect_3}',
        '${question.category_id}'
    );`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
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
        \`answer\` = "${question.answer}", 
        \`deleted\` = "${question.deleted}",
        \`incorrect_1\` = "${question.incorrect_1}", 
        \`incorrect_2\` = "${question.incorrect_2}", 
        \`incorrect_3\` = "${question.incorrect_3}", 
        \`category_id\` = "${question.category_id}"
    WHERE \`question_id\` = ${question.question_id}
    ;`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};

/**
 * DELETE /questions?questionId=3
 * Mark a question record as deleted in database with the following id
 */
export const remove = (req: Request, res: Response) => {
    const questionId = req.query.id;
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
    });
};

export const deleteQuestion = (req: Request, res: Response) => {
    const id = req.query.id;
    const statement = `
    DELETE
    FROM question
    WHERE question.question_id = ${id};
  `;
    connection.query(statement, (error, results) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    });
};
