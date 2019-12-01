import {connection} from '../util/database';
import {User} from '../models/user';

export const selectUser = (page: number, userId: number, username: string, email: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        SELECT user.user_id,
            user.username,
            user.email,
            user.password,
            user.avatar,
            user.administrator,
            user.date_registered
        FROM user
        ${userId != undefined ? `WHERE user.user_id = ${userId}`
            : username != undefined ? `WHERE user.username = '${username}'`
                : email != undefined ? `WHERE user.email = '${email}'` : ''};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const users = parseUsersFromResults(results);
                const startIndex = (page - 1) * 10;
                resolve({
                    page: page,
                    total: users.length,
                    results: users.splice(startIndex, 10)
                });
            }
        });
    });
};

export const selectUserCount = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        const statement = `
        SELECT COUNT(*) as userCount
        FROM user;
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
};

export const insertUser = (user: User): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
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
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const updateUser = (user: User): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        UPDATE user
        SET user.username = '${user.username}',
            user.email = '${user.email}',
            user.password = '${user.password}',
            user.avatar = '${user.avatar}',
            user.date_registered = '${user.date_registered}'
        WHERE user_id = ${user.user_id};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const deleteUser = (userIds: string[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        DELETE
        FROM user
        WHERE user.user_id 
        IN (${userIds.toString()});
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const parseUsersFromResults = (results: any): User[] => {
    const users: User[] = [];
    for (let i = 0; i < results.length; i++) {
        const user: User = {
            user_id: results[i].user_id,
            username: results[i].username,
            email: results[i].email,
            password: results[i].password,
            avatar: results[i].avatar,
            administrator: results[i].administrator,
            date_registered: results[i].date_registered
        };
        users.push(user);
    }
    return users;
};
