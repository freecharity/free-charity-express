import app from '../app';
import supertest, {Response} from 'supertest';
import {Question} from '../models/question';
import {Category} from '../models/category';
import {deleteCategory, insertCategory} from '../database/categories';

const request = supertest(app);

const category: Category = {
    category_id: -1,
    name: 'test_question_category',
    group: 'test_category_group',
    description: 'this category is for testing the questions endpoint',
    image: '1'
};

const question: Question = {
    question_id: -1,
    question: 'test_question',
    answer: 'test_answer',
    incorrect_1: 'test_incorrect_1',
    incorrect_2: 'test_incorrect_2',
    incorrect_3: 'test_incorrect3',
    category_id: -1
};

beforeAll(async () => {
    await insertCategory(category).then((response) => {
        category.category_id = response.insertId;
        question.category_id = category.category_id;
    });
});

afterAll(async () => {
    await deleteCategory([category.category_id.toString()]);
});

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
    const response: Response = await request.get('/questions?page=1');
    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeGreaterThan(0);
    done();
});

it('Gets questions by Category Name', async done => {
    // Sends GET Request to /questions?page={page}&deleted={deleted}&category={}
    const response: Response = await request.get('/questions?page=1&category=calculus');
    expect(response.status).toBe(200);
    done();
});

it('Gets a question by its id', async done => {
    // Sends GET Request to /questions
    const response: Response = await request.get(`/questions?page=1&id=${question.question_id}`);
    expect(response.status).toBe(200);
    expect(response.body.results.length).toBe(1);
    done();
});

it('Fails to get a question with a non-existing id', async done => {
    // Sends GET Request to /questions
    const response: Response = await request.get('/questions?page=1&id=1234567890');
    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
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

it('Deletes a question by Question Id', async done => {
    // Send DELETE Request to /questions?questionId={id}
    const questionIds = [question.question_id];
    const response: Response = await request.delete(`/questions?ids=${questionIds}`);
    expect(response.status).toBe(200);
    expect(response.body.affectedRows).toBe(1);
    done();
});
