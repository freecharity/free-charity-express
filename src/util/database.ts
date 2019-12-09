import mysql from 'mysql';
import {DATABASE} from './secrets';

const Sequelize = require('sequelize');

export const connection = mysql.createPool({
    connectionLimit: 50,
    host: DATABASE.host,
    user: DATABASE.user,
    password: DATABASE.password,
    database: DATABASE.database
});

export const sequelize = new Sequelize(DATABASE.database, DATABASE.user, DATABASE.password, {
    host: DATABASE.host,
    dialect: 'mysql',
    pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log("Connection is good.")
}).catch((error: any) => {
    console.error(error)
});