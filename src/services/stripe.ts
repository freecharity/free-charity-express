import {STRIPE_KEY} from "../util/secrets";
import Payment from "../models/payment";
import Stripe from "stripe";

export const submitPayment = (payment: Payment) => {
    return new Promise((resolve, reject) => {
        const stripe = new Stripe(STRIPE_KEY);
        stripe.charges.create({
            amount: payment.amount * 100,
            currency: "usd",
            source: payment.id
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
};