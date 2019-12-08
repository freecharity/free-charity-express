const supertest = require('supertest');
import app from '../app';
import {Response} from 'supertest';

const request = supertest(app);

describe('Test leaderboard endpoints', () => {
    it('Returns a top 10 leaderboard object', async () => {
        const response: Response = await request.get('/leaderboard?count=10');
        expect(response.status).toBe(200);
        expect(response.body.members).not.toBeNull();
    });
});
