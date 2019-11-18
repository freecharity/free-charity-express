import mysql from "mysql";
import {DATABASE} from "./secrets";

export const connection = mysql.createConnection({
    host: DATABASE.host,
    user: DATABASE.user,
    password: DATABASE.password,
    database: DATABASE.database
});

connection.connect();