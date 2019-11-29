import {Question} from '../models/question';
import {connection} from '../util/database';

export const select = (page: number, deleted: boolean, questionId?: number, category?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        let statement = `
        SELECT question.question_id,
            question.question,
            question.answer,
            question.incorrect_1,
            question.incorrect_2,
            question.incorrect_3,
            question.deleted,
            question.category_id,
            (SELECT category.name
             FROM category
             WHERE category.category_id = question.category_id)
             AS category_name
        FROM question, category
        WHERE question.category_id = category.category_id
        AND question.deleted != ${deleted ? -1 : 1}
        ${questionId != undefined ? `AND question_id = ${questionId}` : ''}
        ${category != undefined ? `AND category.name = '${category}'` : ''}
        ;`;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
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
                resolve({
                    page: page,
                    total: questions.length,
                    results: questions.splice(startIndex, 10)
                });
            }
        });
    });
};

export const insert = (question: Question): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        INSERT INTO question(
            question.question,
            question.answer,
            question.deleted,
            question.incorrect_1,
            question.incorrect_2,
            question.incorrect_3,
            question.category_id
        ) VALUES (
            '${question.question}',
            '${question.answer}',
            '${question.deleted}',
            '${question.incorrect_1}',
            '${question.incorrect_2}',
            '${question.incorrect_3}',
            '${question.category_id}'
        );`;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const update = (question: Question): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        UPDATE question
        SET question.question = "${question.question}", 
            question.answer = "${question.answer}", 
            question.deleted = "${question.deleted}",
            question.incorrect_1 = "${question.incorrect_1}", 
            question.incorrect_2 = "${question.incorrect_2}", 
            question.incorrect_3 = "${question.incorrect_3}", 
            question.category_id = "${question.category_id}"
        WHERE question.question_id = ${question.question_id}
        ;`;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const markDeleted = (questionId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        UPDATE question
        SET deleted = 1
        WHERE question_id = ${questionId};
        `;
        connection.query(statement, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const deleteQuestion = (questionId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        DELETE
        FROM question
        WHERE question.question_id = ${questionId};
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
