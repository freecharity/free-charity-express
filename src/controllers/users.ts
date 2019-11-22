import {Request, Response} from 'express';
import {User} from '../models/user';
import {connection} from '../util/database';

/**
 * GET /users/
 * Retrieve all users from database
 */
export const get = (req: Request, res: Response) => {
    const userId = req.query.userId;
    const username = req.query.username;
    const email = req.query.email;
    let identifier: any = [undefined, undefined];
    if (userId != undefined) {
        identifier = ['user_id', userId]
    } else if (username != undefined) {
        identifier = ['username', username];
    } else if (email != undefined) {
        identifier = ['email', email];
    }
    const sqlQuery = `
    SELECT user_id,
        \`username\`,
        \`email\`,
        \`password\`,
        \`avatar\`,
        \`deleted\`,
        \`date_registered\`
    FROM user
    ${identifier[0] != undefined ? `WHERE ${identifier[0]} = '${identifier[1]}'` : ''}
    ;`;
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.status(400).send(error);
        } else {
            const users: User[] = [];
            for (let i = 0; i < results.length; i++) {
                const user: User = {
                    user_id: results[i].user_id,
                    username: results[i].username,
                    email: results[i].email,
                    password: results[i].password,
                    deleted: results[i].deleted,
                    avatar: results[i].avatar,
                    date_registered: results[i].date_registered
                };
                users.push(user);
            }
            res.status(200).send(users);
        }
    });
};

/**
 * POST /users/
 * Insert a user record into database
 */
export const post = (req: Request, res: Response) => {
    const user: User = req.body;
    const sqlQuery = `
    INSERT INTO user(
        username,
        email,
        password,
        avatar,
        date_registered
    ) VALUES (
        '${user.username}',
        '${user.email}',
        '${user.password}',
        '${user.avatar}',
        '${user.date_registered}'
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
 * PUT /users/
 * Update a user record in database with the following id
 */
export const put = (req: Request, res: Response) => {
    const user: User = req.body;
    const sqlQuery = `
    UPDATE user
    SET username = '${user.username}',
        email = '${user.email}',
        password = '${user.password}',
        avatar = '${user.avatar}',
        date_registered = '${user.date_registered}'
    WHERE user_id = ${user.user_id};
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
 * DELETE /users/
 * Delete a user record in database with the following id
 */
//TODO add delete users method
