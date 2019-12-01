import {connection} from '../util/database';
import {Donation} from '../models/donation';

export const selectDonations = (count: number): Promise<Donation[]> => {
    return new Promise<Donation[]>((resolve, reject) => {
        const statement = `
        SELECT SUM(donation.amount) as totalDonated,
               donation.username,
               user.avatar
        FROM donation, user
        WHERE donation.user_id = user.user_id
        GROUP BY donation.username
        ORDER BY totalDonated DESC
        LIMIT ${count};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const donations: Donation[] = parseDonationsFromResults(results);
                resolve(donations);
            }
        });
    });
};

export const selectDonationTotal = (): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        const statement = `
        SELECT SUM(donation.amount) as totalDonated, 
        donation.username
        FROM donation;
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

const parseDonationsFromResults = (results: any): Donation[] => {
    const donations: Donation[] = [];
    for (let i = 0; i < results.length; i++) {
        const donation: Donation = {
            username: results[i].username,
            totalDonated: results[i].totalDonated,
            avatar: results[i].avatar
        };
        donations.push(donation);
    }
    return donations;
};
