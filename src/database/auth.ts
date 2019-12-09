import {selectUser} from './users';
import {userSession} from '../util/userSession';
import {User, UserModel} from '../models/user';

export const loginUser = (username: string, password: string): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        UserModel.findAll({
            where: {
                username: username,
                password: password
            }
        }).then((results: any) => {
            let user = undefined;
            if (results.length > 0) {
                user = results[0].dataValues;
                resolve(user);
            } else {
                reject({message: 'User with those credentials not found.'});
            }
        }).catch((error: any) => {
            reject(error);
        });
    });
};

export const registerUser = (username: string, password: string, email: string): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        UserModel.create({
            username: username,
            password: password,
            email: email,
            avatar: 'avatar_1',
            administrator: 0,
            date_registered: new Date().toISOString()
        }).then((result: any) => {
            const user: User = {
                user_id: result.null,
                username: result.dataValues.username,
                password: result.dataValues.password,
                email: result.dataValues.email,
                avatar: result.dataValues.avatar,
                administrator: result.dataValues.administrator,
                date_registered: result.dataValues.date_registered
            };
            resolve(user);
        }).catch((error: any) => {
            if (error.fields && error.fields.username_UNIQUE) {
                reject({message: "An account with that username already exists!"})
            } else if (error.fields && error.fields.email_UNIQUE) {
                reject({message: "An account with that email already exists!"});
            } else {
                reject({message: "An unknown error has occurred!", error});
            }
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
