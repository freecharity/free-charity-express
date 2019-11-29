import app from '../app';
import supertest, {Response} from 'supertest';
import {Category} from '../models/category';

const request = supertest(app);

const category: Category = {
    category_id: -1,
    name: 'test_category',
    group: 'test_category_group',
    description: 'this category is for testing purposes',
    image: '1'
};

it('Posts a category', async done => {
    // Sends POST Request to /categories
    const response: Response = await request.post('/categories').send(category);
    expect(response.status).toBe(200);
    category.category_id = response.body.insertId;
    done();
});

it('Gets categories', async done => {
    // Sends GET Request to /categories?page=1&deleted=false
    const response: Response = await request.get('/categories?page=1&deleted=false');
    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeGreaterThan(0);
    done();
});

it('Updates a category', async done => {
    // Sends PUT Request to /categories
    category.name = 'test_category_updated';
    const response: Response = await request.put('/categories').send(category);
    expect(response.status).toBe(200);
    expect(response.body.affectedRows).toBe(1);
    done();
});

it('Deletes a category', async done => {
    // Sends DELETE Request to /categories?id=${category.category_id}
    const response: Response = await request.delete(`/categories?id=${category.category_id}`);
    expect(response.status).toBe(200);
    done();
});
