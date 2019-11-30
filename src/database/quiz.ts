import {connection} from '../util/database';
import {Question} from '../models/question';
import {Answer} from '../models/answer';
import {insertAnswer} from './answers';

export const getQuestions = (categoryName: string): Promise<Question[]> => {
    return new Promise<Question[]>((resolve, reject) => {
        const statement = `
        SELECT question.question_id,
            question.question,
            question.answer,
            question.incorrect_1,
            question.incorrect_2,
            question.incorrect_3,
            question.category_id,
            category.name AS category_name
        FROM question
        INNER JOIN category ON question.category_id = category.category_id
        WHERE question.category_id = (SELECT category.category_id
                                      FROM category
                                      WHERE category.name = '${categoryName}');
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const questions = parseQuestionsFromResults(results);
                resolve(questions);
            }
        });
    });
};

export const postAnswer = (answer: Answer): Promise<Answer> => {
    return new Promise<Answer>((resolve, reject) => {
        insertAnswer(answer).then((results) => {
            answer.answer_id = results.insertId;
            resolve(answer);
        }).catch((error) => {
            reject(error);
        });
    });
};

const parseQuestionsFromResults = (results: any): Question[] => {
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
