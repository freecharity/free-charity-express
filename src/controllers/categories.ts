import {Request, Response} from "express";
import {Category} from '../models/category';
import {connection} from '../util/database';

/**
 * GET /categories/
 * Retrieve all categories from database
 */
export const get = (req: Request, res: Response) => {
    const category = req.query.categoryName;
    const sqlQuery = `
    SELECT category_id,
        category_name,
        category_group,
        category_description,
        category_image
    FROM category
    ${category != undefined ? `WHERE category_name = '${category}'` : ''};
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            const categories: Category[] = [];
            for (let i = 0; i < results.length; i++) {
                const category: Category = {
                    category_id: results[i].category_id,
                    category_name: results[i].category_name,
                    category_group: results[i].category_group,
                    category_description: results[i].category_description,
                    category_image: results[i].category_image
                };
                categories.push(category);
            }
            res.status(200).send(categories);
        }
    });
};


/**
 * POST /categories/
 * Insert a category record into database
 */
export const post = (req: Request, res: Response) => {
    const category: Category = req.body;
    const sqlQuery = `
    INSERT INTO category(
        category_name,
        category_group,
        category_description,
        category_image
    ) VALUES (
        '${category.category_name}',
        '${category.category_group}',
        '${category.category_description}',
        '${category.category_image}'
    );
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(results);
        }
    });
};

/**
 * PUT /categories/
 * Update a category record with the following id
 */
export const put = (req: Request, res: Response) => {
    const category: Category = req.body;
    const sqlQuery = `
    UPDATE category
    SET category_group = 'category_group_value',
        category_description = 'category_description_value',
        category_image = 'category_image_value'
    WHERE category_id = 1;
    `;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};