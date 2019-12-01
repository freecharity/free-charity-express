import {Request, Response} from 'express';
import {selectDonations, selectDonationTotal} from '../database/donation';
import {Donation} from '../models/donation';

export const get = (req: Request, res: Response) => {
    const count: number = req.query.count ? parseInt(req.query.count) : undefined;
    selectDonations(count).then((donations: Donation[]) => {
        res.status(200).json(donations);
    }).catch((error) => {
        res.status(400).json(error);
    });
};

export const getTotal = (req: Request, res: Response) => {
    selectDonationTotal().then((total: number) => {
        res.status(200).json(total);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
