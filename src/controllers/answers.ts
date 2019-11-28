import {Request, Response} from 'express';
import {Answer} from '../models/answer';
import {connection} from '../util/database';

/**
 * GET /answers?page={1}&deleted={0}&correct={0}
 * GET /answers?page={1}&deleted={0}&correct={0}&username={'jason'}
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page;
    const deleted: number = req.query.deleted;
    const correct: number = req.query.correct;
    const username: string = req.query.username;
    const sqlQuery = `
    SELECT answer.answer_id,
        answer.answer,
        answer.correct,
        answer.deleted,
        answer.ip,
        answer.date_answered,
        answer.question_id,
        answer.user_id
    FROM answer
    WHERE answer.deleted != ${deleted == 0 ? 2 : 1}
    ${correct === 1 ? 'AND answer.correct = 1' : ''}
    ${username != undefined ?
        `AND user_id = (SELECT user.user_id
                  FROM user
                  WHERE username = '${username}');` : ''}
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            const answers: Answer[] = [];
            for (let i = 0; i < results.length; i++) {
                const answer: Answer = {
                    answer_id: results[i].answer_id,
                    answer: results[i].answer,
                    correct: results[i].correct,
                    deleted: results[i].deleted,
                    ip: results[i].ip,
                    date_answered: results[i].date_answered,
                    question_id: results[i].question_id,
                    user_id: results[i].user_id
                };
                answers.push(answer);
            }
            const startIndex = (page - 1) * 10;
            const endIndex = (page * 10) - 1;
            res.status(200).send({
                page: page,
                total: answers.length,
                results: answers.splice(startIndex, 10)
            });
        }
    });
};

/**
 * POST /answers/
 * Insert an answer record into database
 */
export const post = (req: Request, res: Response) => {
    const answer: Answer = req.body;
    // const sqlQuery = `
    // INSERT INTO answer(
    //     \`ip\`,
    //     \`correct\`,
    //     \`answer\`,
    //     \`deleted\`,
    //     \`date_answered\`,
    //     \`question_id\`,
    //     \`user_id\`
    // ) VALUES (
    //     '${answer.ip}',
    //     ${answer.correct},
    //     '${answer.answer}',
    //     ${answer.deleted},
    //     '${answer.date_answered}',
    //     ${answer.question_id},
    //     (SELECT user.user_id
    //     FROM user
    //     WHERE user.username = ${answer.username})
    // );
    // `;
    const sqlQuery = `
    INSERT INTO answer(
        answer.ip,
        answer.correct,
        answer.answer,
        answer.deleted,
        answer.date_answered,
        answer.question_id,
        answer.user_id
        ) VALUES (
        '${answer.ip}',
        ${answer.correct},
        '${answer.answer}',
        ${answer.deleted},
        '${answer.date_answered}',
        ${answer.question_id},
        (SELECT user.user_id
        FROM user
        WHERE user.username = '${answer.username}'));
    `;

    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    });
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
    SET ip_address = '${answer.ip}',
        correct = ${answer.correct ? 1 : 0},
        answer = '${answer.answer}',
        deleted = ${answer.deleted ? 1 : 0},
        datetime = '${answer.date_answered}',
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
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    });
};
