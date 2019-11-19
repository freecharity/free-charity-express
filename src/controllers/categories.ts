import {Request, Response} from "express";
import {Category} from '../models/category';
import {connection} from '../util/database';

/**
 * GET /categories/
 * Retrieve all categories from database
 */
export const get = (req: Request, res: Response) => {
    const page = req.query.page;
    const categoryName = req.query.categoryName;
    const categoryId = req.query.categoryId;
    const sqlQuery = `
    SELECT category_id,
        \`name\`,
        \`group\`,
        \`description\`,
        \`image\`,
        \`deleted\`
    FROM category
    WHERE deleted != 1
    ${categoryName != undefined ? `AND name = '${categoryName}'` : ''}
    ${categoryId != undefined ? `AND category_id = '${categoryId}'` : ''}
    ;`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            const categories: Category[] = [];
            for (let i = 0; i < results.length; i++) {
                const category: Category = {
                    category_id: results[i].category_id,
                    name: results[i].name,
                    group: results[i].group,
                    description: results[i].description,
                    image: results[i].image,
                    deleted: results[i].deleted == 1
                };
                categories.push(category);
            }

            const startIndex = (page-1) * 10;
            const endIndex = (page*10) - 1;
            res.status(200).send({
                page: page,
                total: categories.length,
                results: categories.splice(startIndex, 10)
            });
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
        \`name\`,
        \`group\`,
        \`description\`,
        \`image\`,
        \`deleted\`
    ) VALUES (
        '${category.name}',
        '${category.group}',
        '${category.description}',
        '${category.image}',
        '${category.deleted}'
    );`;
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
    SET \`name\` = '${category.name}',
        \`group\` = '${category.group}',
        \`description\` = '${category.description}',
        \`image\` = '${category.image}',
        \`deleted\` = '${category.deleted ? 1 : 0}'
    WHERE \`category_id\` = ${category.category_id}
    ;`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};

/**
 * DELETE /categories/
 * Delete a category record with the following id
 */
export const remove = (req: Request, res: Response) => {
    const categoryId = req.query.categoryId;
    const sqlQuery = `
    UPDATE category
    SET \`deleted\` = 1
    WHERE \`category_id\` = ${categoryId}
    ;`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(results);
        }
    });
};