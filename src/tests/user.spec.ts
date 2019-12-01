import app from '../app';
import supertest, {Response} from 'supertest';
import {User} from '../models/user';

const request = supertest(app);

const user: User = {
    user_id: -1,
    username: 'test_username',
    email: 'test_email@test.com',
    password: 'test_password',
    avatar: '1',
    administrator: 1,
    date_registered: new Date().toISOString()
};

describe('Test user endpoints', () => {
    it('Inserts a user', async done => {
        const response: Response = await request.post('/users').send(user);
        expect(response.status).toBe(200);
        user.user_id = response.body.insertId;
        done();
    });

    it('Gets users', async done => {
        const response: Response = await request.get('/users?page=1');
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(1);
        done();
    });

    it('Gets a user by id', async done => {
        const response: Response = await request.get(`/users?page=1&id=${user.user_id}`);
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(1);
        expect(response.body.total).toBe(1);
        expect(response.body.results.length).toBe(1);
        done();
    });

    it('Gets a user by username', async done => {
        const response: Response = await request.get(`/users?page=1&username=${user.username}`);
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(1);
        expect(response.body.total).toBe(1);
        expect(response.body.results.length).toBe(1);
        done();
    });

    it('Gets a user by email address', async done => {
        const response: Response = await request.get(`/users?email=${user.email}`);
        expect(response.status).toBe(200);
        expect(response.body.results.length).toBe(1);
        done();
    });

    it('Gets user count', async done => {
        const response: Response = await request.get('/users/count/');
        expect(response.status).toBe(200);
        expect(response.body.userCount).toBeGreaterThan(0);
        done();
    });

    it('Updates a users username', async done => {
        user.username += '_updated';
        const response: Response = await request.put('/users').send(user);
        expect(response.status).toBe(200);
        expect(response.body.affectedRows).toBe(1);
        done();
    });

    it('Deletes a user by user id', async done => {
        const response: Response = await request.delete(`/users?id=${user.user_id}`);
        expect(response.status).toBe(200);
        expect(response.body.affectedRows).toBe(1);
        done();
    });
});

