import mysql from 'mysql';
import {DATABASE} from './secrets';

export const connection = mysql.createPool({
    connectionLimit: 50,
    host: DATABASE.host,
    user: DATABASE.user,
    password: DATABASE.password,
    database: DATABASE.database
});
