import {Request, Response} from 'express';
import {connection} from '../util/database';
import {Question} from '../models/question';

/*
 * GET localhost:3000/quiz?categoryName={categoryName}
 * Returns all questions for a given category
 * */
export const get = (req: Request, res: Response) => {
    const categoryName = req.query.categoryName;
    const sqlQuery = `
    SELECT question.question_id,
        question.question,
        question.answer,
        question.incorrect_1,
        question.incorrect_2,
        question.incorrect_3,
        question.deleted,
        question.category_id,
        category.name AS category_name
    FROM question
    INNER JOIN category ON question.category_id = category.category_id
    WHERE question.category_id = (SELECT category.category_id
                                  FROM category
                                  WHERE category.name = '${categoryName}')
    ;`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            const questions: Question[] = [];
            for (let i = 0; i < results.length; i++) {
                const question: Question = {
                    question_id: results[i].question_id,
                    question: results[i].question,
                    answer: results[i].answer,
                    incorrect_1: results[i].incorrect_1,
                    incorrect_2: results[i].incorrect_2,
                    incorrect_3: results[i].incorrect_3,
                    category_id: results[i].category_id
                };
                questions.push(question);
            }
            res.send(questions);
        }
    });
};
