import {Request, Response} from "express";
import {Answer} from '../models/answer';
import {connection} from '../util/database';

/**
 * GET /answers/
 * GET /answers?userId={id}
 * GET /answers?correct=true
 */
export const get = (req: Request, res: Response) => {
    const userId = req.query.userId;
    const correct = req.query.correct != undefined;
    let sqlQuery = `
    SELECT
        answer_id,
        ip_address,
        correct,
        answer,
        deleted,
        datetime,
        question_id,
        user_id
    FROM answer
    WHERE deleted = 0
    ${correct ? 'AND correct = 1' : ''};
  `;
    if (userId != undefined) {
        sqlQuery = `
        SELECT
            answer_id,
            ip_address,
            correct,
            answer,
            deleted,
            datetime,
            question_id,
            user_id
        FROM answer
        WHERE deleted = 0
        AND user_id = ${userId}
        ${correct ? 'AND correct = 1' : ''};
        `;
    }
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            const answers: Answer[] = [];
            for (let i = 0; i < results.length; i++) {
                const answer: Answer = {
                    answer_id: results[i].answer_id,
                    ip_address: results[i].ip_address,
                    correct: results[i].correct === 1,
                    answer: results[i].answer,
                    deleted: results[i].deleted === 1,
                    datetime: results[i].datetime,
                    question_id: results[i].question_id,
                    user_id: results[i].user_id
                };
                answers.push(answer);
            }
            res.status(200).send(answers);
        }
    });
};

/**
 * POST /answers/
 * Insert an answer record into database
 */
export const post = (req: Request, res: Response) => {
    const answer: Answer = req.body;
    const sqlQuery = `
    INSERT INTO answer(
        ip_address,
        correct,
        answer,
        deleted,
        datetime,
        question_id,
        user_id
    ) VALUES (
        '${answer.ip_address}',
        ${answer.correct ? 1 : 0},
        '${answer.answer}',
        ${answer.deleted ? 1 : 0},
        '${answer.datetime}',
        ${answer.question_id},
        ${answer.user_id}
    );
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    })
};

/**
 * PUT /answers/
 * Update an answer record with the following id
 */
export const put = (req: Request, res: Response) => {
    const answer: Answer = req.body;
    console.log(answer);
    const sqlQuery = `
    UPDATE answer
    SET ip_address = '${answer.ip_address}',
        correct = ${answer.correct ? 1 : 0},
        answer = '${answer.answer}',
        deleted = ${answer.deleted ? 1 : 0},
        datetime = '${answer.datetime}',
        question_id = ${answer.question_id},
        user_id = ${answer.user_id}
    WHERE answer_id = ${answer.answer_id};
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    })
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
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    });
};