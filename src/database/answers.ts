import {Answer} from '../models/answer';
import {connection} from '../util/database';

export const selectAnswer = (page: number, correct: number, username?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        SELECT answer.answer_id,
            answer.answer,
            answer.correct,
            answer.ip,
            answer.date_answered,
            answer.question_id,
            answer.user_id
        FROM answer
        WHERE answer.answer_id > 0
        ${correct == 1 ? 'AND answer.correct = 1' : ''}
        ${username != undefined ? `AND user_id = (SELECT user.user_id
             FROM user
             WHERE username = '${username}')` : ''};
        `;
        connection.query(statement, (error, results) => {
            const answers: Answer[] = parseAnswersFromResults(results);
            if (error) {
                reject(error);
            } else {
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

export const selectAnswerCount = (correct: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const statement = `
        SELECT COUNT(*) as answerCount
        FROM answer
        WHERE answer.correct = ${correct};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
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
            answer.date_answered,
            answer.question_id,
            answer.user_id
            ) VALUES (
            '${answer.ip}',
            ${answer.correct},
            '${answer.answer}',
            '${answer.date_answered}',
            ${answer.question_id},
            ${answer.user_id});
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

export const deleteAnswers = (answerIds: string[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        DELETE
        FROM answer
        WHERE answer.answer_id
        IN (${answerIds.toString()}); 
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

const parseAnswersFromResults = (results: any): Answer[] => {
    const answers: Answer[] = [];
    for (let i = 0; i < results.length; i++) {
        const answer: Answer = {
            answer_id: results[i].answer_id,
            answer: results[i].answer,
            correct: results[i].correct,
            ip: results[i].ip,
            date_answered: results[i].date_answered,
            question_id: results[i].question_id,
            user_id: results[i].user_id
        };
        answers.push(answer);
    }
    return answers;
};
