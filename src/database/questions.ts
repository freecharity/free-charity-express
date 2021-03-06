import {Question} from '../models/question';
import {connection} from '../util/database';

export const selectQuestion = (page: number, questionId?: number, category?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        let statement = `
        SELECT question.question_id,
            question.question,
            question.answer,
            question.incorrect_1,
            question.incorrect_2,
            question.incorrect_3,
            question.category_id
        FROM question
        ${questionId != undefined ? `WHERE question_id = ${questionId}` : ''};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const startIndex = (page - 1) * 10;
                const questions: Question[] = parseQuestionsFromResults(results);
                resolve({
                    page: page,
                    total: questions.length,
                    results: questions.splice(startIndex, 10)
                });
            }
        });
    });
};

export const insertQuestion = (question: Question): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        INSERT INTO question(
            question.question,
            question.answer,
            question.incorrect_1,
            question.incorrect_2,
            question.incorrect_3,
            question.category_id
        ) VALUES (
            '${question.question}',
            '${question.answer}',
            '${question.incorrect_1}',
            '${question.incorrect_2}',
            '${question.incorrect_3}',
            '${question.category_id}');
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

export const updateQuestion = (question: Question): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        UPDATE question
        SET question.question = "${question.question}", 
            question.answer = "${question.answer}",
            question.incorrect_1 = "${question.incorrect_1}", 
            question.incorrect_2 = "${question.incorrect_2}", 
            question.incorrect_3 = "${question.incorrect_3}", 
            question.category_id = "${question.category_id}"
        WHERE question.question_id = ${question.question_id};
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

export const deleteQuestion = (questionIds: string[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        DELETE
        FROM question
        WHERE question.question_id IN (${questionIds.toString()});
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

const parseQuestionsFromResults = (results: any) => {
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
    return questions;
};
