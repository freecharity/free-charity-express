const supertest = require('supertest');
import app from '../app';
import {Response} from 'supertest';

const request = supertest(app);

describe('Test donation endpoints', () => {
    it('Returns a top 3 donations', async () => {
        const response: Response = await request.get('/donation?count=3');
        expect(response.status).toBe(200);
        expect(response.body.donations).not.toBeNull();
    });

    it('Returns total amount donated', async () => {
        const response: Response = await request.get('/donation/total');
        expect(response.status).toBe(200);
        expect(response.body.total).not.toBeNull();
    });
});
