import {Request, Response} from 'express';
import {selectLeaderboard} from '../database/leaderboard';
import {Leaderboard} from '../models/leaderboard';

/**
 * GET /leaderboard/
 * Gets Top {count} participants on the Leaderboard
 */
export const get = (req: Request, res: Response) => {
    const count: number = req.query.count ? parseInt(req.query.count) : undefined;
    selectLeaderboard(count).then((leaderboard: Leaderboard) => {
        res.status(200).json(leaderboard);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
