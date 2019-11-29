import app from '../app';
import supertest, {Response} from 'supertest';
import {Question} from '../models/question';

const request = supertest(app);

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

it('Fails to post a duplicate question', async done => {
    // Send POST Request to /questions
    const response: Response = await request.post('/questions').send(question);
    expect(response.status).toBe(400);
    done();
});

it('Gets questions', async done => {
    // Sends GET Request to /questions?page={page}&deleted={deleted}
    const response: Response = await request.get('/questions?page=1&deleted=false');
    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeGreaterThan(0);
    done();
});

it('Gets questions by Category Name', async done => {
    // Sends GET Request to /questions?page={page}&deleted={deleted}&category={}
    const response: Response = await request.get('/questions?page=1&deleted=false&category=calculus');
    expect(response.status).toBe(200);
    done();
});

it('Gets a question by its id', async done => {
    // Sends GET Request to /questions
    const response: Response = await request.get(`/questions?page=1&deleted=false&id=${question.question_id}`);
    expect(response.status).toBe(200);
    expect(response.body.results.length).toBe(1);
    done();
});

it('Fails to get a question with a non-existing id', async done => {
    // Sends GET Request to /questions
    const response: Response = await request.get('/questions?page=1&deleted=false&id=1234567890');
    expect(response.status).toBe(200);
    expect(response.body.results.length).toBe(0);
    done();
});

it('Updates a question', async done => {
    // SEND PUT Request to /questions
    question.question = 'test_updated_question';
    const response: Response = await request.put('/questions').send(question);
    expect(response.status).toBe(200);
    expect(response.body.affectedRows).toBe(1);
    done();
});

it('Marks a question as deleted', async done => {
    // SEND DELETE Request to /questions?id={id}
    const response: Response = await request.delete(`/questions?id=${question.question_id}`).send(question);
    expect(response.status).toBe(200);
    expect(response.body.affectedRows = 1);
    done();
});

it('Deletes a question by Question Id', async done => {
    // Send DELETE Request to /questions?questionId={id}
    const response: Response = await request.delete(`/questions/delete?id=${question.question_id}`);
    expect(response.status).toBe(200);
    done();
});
