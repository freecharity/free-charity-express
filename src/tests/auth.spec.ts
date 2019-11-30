import app from '../app';
import supertest, {Response} from 'supertest';
import {User} from '../models/user';
import {deleteUser} from '../database/users';
import {Session} from '../models/session';

const request = supertest(app);

const user: User = {
    user_id: -1,
    username: 'auth_test',
    email: 'auth_test_email@email.com',
    password: 'password_test',
    avatar: 'avatar_1',
    administrator: 0,
    date_registered: new Date().toISOString()
};

const session: Session = {
    username: undefined,
    sessionId: undefined
};

describe('Test auth controller', () => {
    afterAll(async () => {
        await deleteUser([user.user_id.toString()]);
    });

    it('Registers a user', async done => {
        const response: Response = await request.post('/auth/register').send({
            username: user.username,
            password: user.password,
            email: user.email
        });
        expect(response.status).toBe(200);
        expect(response.body.user_id).not.toBe(-1);
        expect(response.body.username).toBe(user.username);
        expect(response.body.password).toBe(user.password);
        expect(response.body.email).toBe(user.email);
        expect(response.body.avatar).toBe(user.avatar);
        expect(response.body.administrator).toBe(user.administrator);
        // update local user_id
        user.user_id = response.body.user_id;
        done();
    });

    it('Logs in a user', async done => {
        const response: Response = await request.post('/auth/login').send({
            username: user.username,
            password: user.password
        });
        expect(response.status).toBe(200);
        expect(response.body.user.user_id).toBe(user.user_id);
        expect(response.body.user.username).toBe(user.username);
        expect(response.body.user.password).toBe(user.password);
        expect(response.body.user.email).toBe(user.email);
        expect(response.body.user.avatar).toBe(user.avatar);
        expect(response.body.user.administrator).toBe(user.administrator);
        expect(response.body.sessionId.length).toBeGreaterThan(0);
        // update local session
        session.username = user.username;
        session.sessionId = response.body.sessionId;
        done();
    });

    it('Fails to login in a user with invalid credentials', async done => {
        const response: Response = await request.post('/auth/login').send({
            username: user.username,
            password: 'incorrect_password'
        });
        expect(response.status).toBe(400);
        done();
    });

    it('Validates a user session', async done => {
        const response: Response = await request.post('/auth/validate').send({
            username: session.username,
            sessionId: session.sessionId
        });
        expect(response.status).toBe(200);
        expect(response.body.user_id).toBe(user.user_id);
        expect(response.body.username).toBe(user.username);
        expect(response.body.password).toBe(user.password);
        expect(response.body.email).toBe(user.email);
        expect(response.body.avatar).toBe(user.avatar);
        expect(response.body.administrator).toBe(user.administrator);
        done();
    });

    it('Logs out a user', async done => {
        const response: Response = await request.post('/auth/logout').send(user);
        expect(response.status).toBe(200);
        done();
    });

    it('Fails to validate a user session after logging out', async done => {
        const response: Response = await request.post('/auth/validate').send({
            username: session.username,
            sessionId: session.sessionId
        });
        expect(response.status).toBe(400);
        done();
    });
});
