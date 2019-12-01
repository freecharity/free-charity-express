import app from '../app';
import supertest, {Response} from 'supertest';
import {Category} from '../models/category';
import {Question} from '../models/question';
import {Answer} from '../models/answer';
import {User} from '../models/user';
import {deleteCategory, insertCategory} from '../database/categories';
import {deleteQuestion, insertQuestion} from '../database/questions';
import {deleteUser, insertUser} from '../database/users';

const request = supertest(app);

const category: Category = {
    category_id: -1,
    name: 'test_answer_category',
    group: 'test_category_group',
    description: 'this category is for testing the answers endpoint',
    image: 'category_1'
};

const question: Question = {
    question_id: -1,
    question: 'test_answer_question',
    answer: 'test_answer',
    incorrect_1: 'test_incorrect_1',
    incorrect_2: 'test_incorrect_2',
    incorrect_3: 'test_incorrect_3',
    category_id: -1
};

const user: User = {
    user_id: -1,
    username: 'test_answer_user',
    email: 'test_answer_email@test.com',
    password: 'test_password',
    avatar: 'avatar_1',
    administrator: 0,
    date_registered: new Date().toISOString()
};

const answer: Answer = {
    answer_id: -1,
    answer: 'test_answer',
    correct: 1,
    ip: 'test.ip.address',
    date_answered: new Date().toISOString(),
    question_id: question.question_id,
    user_id: -1
};

describe('Tests answers endpoint', () => {
    beforeAll(async () => {
        await insertCategory(category).then(async (response) => {
            category.category_id = response.insertId;
            question.category_id = category.category_id;
            await insertQuestion(question).then(async (response) => {
                question.question_id = response.insertId;
                answer.question_id = question.question_id;
                await insertUser(user).then(async (response) => {
                    user.user_id = response.insertId;
                    answer.user_id = user.user_id;
                });
            });
        });

    });

    afterAll(async () => {
        await deleteQuestion([question.question_id.toString()]);
        await deleteCategory([category.category_id.toString()]);
        await deleteUser([user.user_id.toString()]);
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
        expect(response.body.page).toBe(1);
        expect(response.body.results.length).toBeGreaterThan(0);
        done();
    });

    it('Selects correct answer count', async done => {
        const response: Response = await request.get('/answers/count?correct=1');
        expect(response.status).toBe(200);
        expect(response.body.answerCount).toBeGreaterThan(0);
        done();
    });

    it('Selects correct answer count by username', async done => {
        const response: Response = await request.get(`/answers/count/username?correct=1&username=${user.username}`);
        expect(response.status).toBe(200);
        expect(response.body.answerCount).toBeGreaterThan(0);
        done();
    });

    it('Selects answers that are correct', async done => {
        const response: Response = await request.get('/answers?page=1&deleted=0&correct=1');
        expect(response.body.page).toBe(1);
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
        const answerIds = [answer.answer_id.toString()];
        const response: Response = await request.delete(`/answers?ids=${answerIds}`);
        expect(response.status).toBe(200);
        expect(response.body.affectedRows).toBe(1);
        done();
    });
});
