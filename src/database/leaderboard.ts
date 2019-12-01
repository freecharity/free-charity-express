import {connection} from '../util/database';
import {Leaderboard, LeaderboardMember} from '../models/leaderboard';

export const selectLeaderboard = (count: number): Promise<Leaderboard> => {
    return new Promise<Leaderboard>((resolve, reject) => {
        const statement = `
        SELECT COUNT(*) as score, user.username
        FROM answer, user
        WHERE answer.user_id = user.user_id
        GROUP BY answer.user_id
        ORDER BY score DESC
        LIMIT ${count};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const leaderboard: Leaderboard = parseLeaderboardFromResults(results);
                resolve(leaderboard);
            }
        });
    });
};

const parseLeaderboardFromResults = (results: any): Leaderboard => {
    const leaderboard: Leaderboard = {
        members: []
    };
    for (let i = 0; i < results.length; i++) {
        const member: LeaderboardMember = {
            username: results[i].username,
            score: results[i].score * 10
        };
        leaderboard.members.push(member);
    }
    return leaderboard;
};
