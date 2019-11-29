import app from '../app';
import supertest, {Response} from 'supertest';
import {Question} from '../models/question';

const request = supertest(app);

/**
 * This file tests the /questions endpoint and the database behind it. It will go through a procedure of inserting
 * a question record into the database, querying it, updating it and finally removing it.
 */

const question: Question = {
    question_id: -1,
    question: 'test_question',
    answer: 'test_answer',
    incorrect_1: 'test_incorrect_1',
    incorrect_2: 'test_incorrect_2',
    incorrect_3: 'test_incorrect3',
    deleted: 0,
    category_name: '',
    category_id: 1
};

it('Posts a question', async done => {
    // Send POST Request to /questions
    const response: Response = await request.post('/questions').send(question);
    expect(response.status).toBe(200);
    question.question_id = response.body.insertId;
    done();
});

it('Gets questions', async done => {
    // Sends GET Request to /questions
    const response: Response = await request.get('/questions?page=1&deleted=false');
    expect(response.status).toBe(200);
    done();
});

it('Gets questions by Category Name', async done => {
    // Sends GET Request to /questions
    const response: Response = await request.get('/questions?page=1&deleted=false&category=calculus');
    expect(response.status).toBe(200);
    done();
});

it('Gets questions by Question Id', async done => {
    // Sends GET Request to /questions
    const response: Response = await request.get(`/questions?page=1&deleted=false&id=${question.question_id}`);
    expect(response.status).toBe(200);
    done();
});

it('Updates a question', async done => {
    // SEND PUT Request to /questions
    const response: Response = await request.put('/questions').send(question);
    expect(response.status).toBe(200);
    done();
});

it('Deletes a question by Question Id', async done => {
    // Send DELETE Request to /questions?questionId={id}
    const response: Response = await request.delete(`/questions?id=${question.question_id}`);
    expect(response.status).toBe(200);
    done();
});
