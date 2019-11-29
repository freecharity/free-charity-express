import {Request, Response} from 'express';
import {User} from '../models/user';
import {connection} from '../util/database';
import {deleteUser, insertUser, selectUser, updateUser} from '../database/users';

/**
 * GET /users/
 * Retrieve all users from database
 */
export const get = (req: Request, res: Response) => {
    const page: number = req.query.page != undefined ? parseInt(req.query.page) : undefined;
    const id: number = req.query.id != undefined ? parseInt(req.query.page) : undefined;
    const username: string = req.query.username;
    const email: string = req.query.email;
    selectUser(page, id, username, email).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
};

/**
 * GET /users/count
 * Return the number of users in the database
 */
export const getCount = (req: Request, res: Response) => {
    const sqlQuery = `
    SELECT COUNT(user.user_id) as user_count
    FROM user;
    `;

    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            const count = results[0].user_count;
            res.status(200).send({count});
        }
    });
};

/**
 * POST /users/
 * Insert a user record into database
 */
export const post = (req: Request, res: Response) => {
    const user: User = req.body;
    insertUser(user).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * PUT /users/
 * Update a user record in database with the following id
 */
export const put = (req: Request, res: Response) => {
    const user: User = req.body;
    updateUser(user).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * DELETE /users/
 * Delete a user record in database with the following id
 */
export const remove = (req: Request, res: Response) => {
    const id: number = req.query.id;
    deleteUser(id).then((response) => {
        res.status(200).json(response);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
