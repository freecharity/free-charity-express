import app from '../app';
import supertest, {Response} from 'supertest';
import {Question} from '../models/question';
import {Answer} from '../models/answer';
import {deleteQuestion, insertQuestion} from '../database/questions';

const request = supertest(app);

const question: Question = {
    question_id: -1,
    question: 'test_answer_question',
    answer: 'test_answer',
    incorrect_1: 'test_incorrect_1',
    incorrect_2: 'test_incorrect_2',
    incorrect_3: 'test_incorrect_3',
    deleted: 0,
    category_name: '', // TODO: Mock Category Name
    category_id: 1 // TODO: Mock Category Id
};

const answer: Answer = {
    answer_id: -1,
    answer: 'test_answer',
    correct: 1,
    deleted: 0,
    ip: 'test.ip.address',
    date_answered: new Date().toISOString(),
    question_id: question.question_id,
    user_id: 2, // TODO Mock User Id
    username: 'jason' // TODO: Mock Username
};

beforeAll(async () => {
    await insertQuestion(question).then((response) => {
        question.question_id = response.insertId;
        answer.question_id = response.insertId;
    });
});

afterAll(async () => {
    await deleteQuestion(question.question_id);
});

it('Posts an answer', async done => {
    const response: Response = await request.post('/answers').send(answer);
    expect(response.status).toBe(200);
    answer.answer_id = response.body.insertId;
    done();
});

it('Selects answers', async done => {
    const response: Response = await request.get('/answers?page=1&deleted=0&correct=0');
    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeGreaterThan(0);
    done();
});

it('Selects answers that are deleted', async done => {
    const response: Response = await request.get('/answers?page=1&deleted=1&correct=0');
    expect(response.status).toBe(200);
    done();
});

it('Selects answers that are correct', async done => {
    const response: Response = await request.get('/answers?page=1&deleted=0&correct=1');
    expect(response.status).toBe(200);
    done();
});

it('Updates an answer', async done => {
    answer.answer = 'test_question_updated_answer';
    const response: Response = await request.put('/answers').send(answer);
    expect(response.status).toBe(200);
    expect(response.body.affectedRows).toBe(1);
    done();
});

it('Deletes an answer', async done => {
    const response: Response = await request.delete(`/answers?answerId=${answer.answer_id}`);
    expect(response.status).toBe(200);
    done();
});
