import {Request, Response} from 'express';
import {userSession} from '../util/userSession';
import {User} from '../models/user';
import {loginUser, logoutUser, registerUser, validateUser} from '../database/auth';

/**
 * POST /auth/login
 */
export const login = (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    loginUser(username, password).then((user) => {
        const session = userSession.addUserSession(user);
        res.status(200).json({user, session});
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * POST /auth/register
 */
export const register = (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const email: string = req.body.email;
    registerUser(username, password, email).then((user) => {
        res.status(200).json(user);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

/**
 * POST /auth/validate
 */
export const validate = (req: Request, res: Response) => {
    const username: string = req.body.username;
    const sessionId: string = req.body.sessionId;
    validateUser(username, sessionId).then((user) => {
        res.status(200).json(user);
    }).catch((error) => {
        res.status(400).json(error);
    })
};

/**
 * POST /auth/logout
 */
export const logout = (req: Request, res: Response) => {
    const user: User = req.body;
    logoutUser(user).then((message) => {
        res.status(200).json(message);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
