import {Request, Response} from 'express';
import {Category} from '../models/category';
import {deleteCategory, insertCategory, selectCategories, updateCategory} from '../database/categories';

/**
 * GET /categories/
 * Retrieve all categories from database
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page != undefined ? parseInt(req.query.page) : undefined;
    const categoryId: number = req.query.categoryId != undefined ? parseInt(req.query.categoryId) : undefined;
    const categoryName: string = req.query.categoryName;
    selectCategories(page, categoryName, categoryId).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * POST /categories/
 * Insert a category record into database
 */
export const post = (req: Request, res: Response) => {
    const category: Category = req.body;
    insertCategory(category).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * PUT /categories/
 * Update a category record with the following id
 */
export const put = (req: Request, res: Response) => {
    const category: Category = req.body;
    updateCategory(category).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * DELETE /categories/
 * Delete category records with the following id
 */
export const remove = (req: Request, res: Response) => {
    const categoryIds: string[] = req.query.ids;
    deleteCategory(categoryIds).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
};
