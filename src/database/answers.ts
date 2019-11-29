import {Answer} from '../models/answer';
import {connection} from '../util/database';

export const selectAnswer = (page: number, deleted: number, correct: number, username?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
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
        ${username != undefined ? `AND user_id = (SELECT user.user_id
             FROM user
             WHERE username = '${username}');` : ''}
        `;
        connection.query(sqlQuery, (error, results, fields) => {
            if (error) {
                reject(error);
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
                resolve({
                    page: page,
                    total: answers.length,
                    results: answers.splice(startIndex, 10)
                });
            }
        });
    });
};

export const insertAnswer = (answer: Answer): Promise<any> => {
    return new Promise((resolve, reject) => {
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
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const updateAnswer = (answer: Answer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
        UPDATE answer
        SET answer.ip = '${answer.ip}',
            answer.correct = ${answer.correct ? 1 : 0},
            answer.answer = '${answer.answer}',
            answer.deleted = ${answer.deleted ? 1 : 0},
            answer.date_answered = '${answer.date_answered}',
            answer.question_id = ${answer.question_id},
            answer.user_id = ${answer.user_id}
        WHERE answer.answer_id = ${answer.answer_id};
        `;
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const deleteAnswer = (answerId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        DELETE
        FROM answer
        WHERE answer.answer_id = ${answerId};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};
