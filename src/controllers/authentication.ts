import {Request, Response} from 'express';
import {connection} from '../util/database';
import {userSession} from '../util/userSession';
import {User} from '../models/user';
import {Session} from '../models/session';

export const loginUser = (req: Request, res: Response) => {
    const user: User = req.body;
    // verify credentials match database
    verifyCredentials(user).then((user: User) => {
        // create new session for user
        const sessionId = userSession.addUserSession(user);
        res.status(200).json({
            message: 'You have been logged in successfully.',
            sessionId,
            user: user
        });
    }).catch((error) => {
        res.status(400).json(error);
    });
};

export const registerUser = (req: Request, res: Response) => {
    const user: User = req.body;
    // verify that username and email don't already exist
    registerCredentials(user).then((user: User) => {
        // create new session for user
        const sessionId = userSession.addUserSession(user);
        res.status(200).json({
            message: 'You have been logged in successfully.',
            sessionId,
            user: user
        });
    }).catch((error) => {
        res.status(400).json(error);
    });
};

export const logoutUser = (req: Request, res: Response) => {
    const user: User = req.body;
    if (userSession.removeUserSession(user)) {
        res.status(200).json({message: 'User logged out successfully'});
    } else {
        res.status(400).json({message: 'Failed to log out user'});
    }
};

export const validateUser = (req: Request, res: Response) => {
    const session: Session = req.body;
    if (userSession.validateSession(session.username, session.sessionId)) {
        retrieveCredentials(session.username).then((user: User) => {
            res.status(200).json({message: 'Session is valid', user});
        }).catch((err) => {
            res.status(400).json(err);
        });
    } else {
        res.status(400).json({message: 'Session is invalid'});
    }
};

const verifyCredentials = async (user: User): Promise<User> => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
        SELECT user.user_id,
            user.username,
            user.email,
            user.password,
            user.deleted,
            user.avatar,
            user.date_registered
        FROM user
        WHERE username = '${user.username}'
        AND password = '${user.password}';
        `;
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                reject(error);
            }
            if (results[0] != undefined) {
                resolve(results[0]);
            } else {
                reject({error: 'User with those credentials not found.'});
            }
        });
    });
};

const retrieveCredentials = async (username: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
        SELECT user.user_id,
            user.username,
            user.email,
            user.password,
            user.deleted,
            user.avatar,
            user.date_registered
        FROM user
        WHERE username = '${username}';
        `;
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                reject(error);
            }
            if (results[0] != undefined) {
                resolve(results[0]);
            } else {
                reject({error: 'User with those credentials not found.'});
            }
        });
    });
};

const registerCredentials = async (user: User): Promise<User> => {
    return new Promise((resolve, reject) => {
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
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const user: User = results[0];
                resolve(user);
            }
        });
    });
};
