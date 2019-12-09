const Sequelize = require('sequelize');

import {sequelize} from "../util/database";

export interface User {
    user_id: number;
    username: string;
    email: string;
    password: string;
    avatar: string;
    administrator: number;
    date_registered: string;
}

export const UserModel = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING
    },
    administrator: {
        type: Sequelize.SMALLINT
    }
}, {
    freezeTableName: true,
    timestamps: false
});
