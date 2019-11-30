import {connection} from '../util/database';
import {insertUser, selectUser} from './users';
import {userSession} from '../util/userSession';
import {User} from '../models/user';

export const loginUser = (username: string, password: string): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        const statement = `
        SELECT *
        FROM user
        WHERE user.username = '${username}'
        AND user.password = '${password}';
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length > 0) {
                resolve(results[0]);
            } else {
                reject({message: 'User with those credentials not found.'});
            }
        });
    });
};

export const registerUser = (username: string, password: string, email: string): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        const user: User = {
            user_id: -1,
            username: username,
            password: password,
            email: email,
            avatar: 'avatar_1',
            administrator: 0,
            date_registered: new Date().toISOString()
        };
        insertUser(user).then((response) => {
            user.user_id = response.insertId;
            resolve(user);
        }).catch((error) => {
            reject(error);
        });
    });
};

export const validateUser = (username: string, sessionId: string): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        const valid = userSession.validateSession(username, sessionId);
        if (valid) {
            selectUser(1, undefined, username, undefined).then((response) => {
                if (response.results[0] != undefined) {
                    resolve(response.results[0]);
                } else {
                    reject({message: 'Could not validate user, does not exist!'});
                }
            }).catch((error) => {
                reject(error);
            });
        } else {
            reject({message: 'Could not validate user session.'});
        }
    });
};

export const logoutUser = (user: User): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        selectUser(1, user.user_id, user.username, user.email).then((response) => {
            if (response.results[0] != undefined) {
                const u: User = response.results[0];
                userSession.removeUserSession(u);
                resolve({message: 'Successfully logged out user!'});
            } else {
                reject({message: 'Could not logout user, does not exist!'});
            }
        }).catch((error) => {
            reject(error);
        });
    });
};
