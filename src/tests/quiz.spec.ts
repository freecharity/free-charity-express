import app from '../app';
import supertest, {Response} from 'supertest';

const request = supertest(app);

describe('Tests quiz endpoint', () => {
    it('Gets questions by category', async done => {
        const categoryName = 'Programming';
        const response: Response = await request.get(`/quiz?categoryName=${categoryName}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        done();
    });
});
