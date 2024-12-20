import { CustomError } from '../utils/customError.js';
import { makeResponse } from '../utils/makeResponse.js';
export class PremiumController {
    static async subscribe(req, res, next) {
        try {
            const user = req.user;
            if (user.isPremium) {
                throw new CustomError(400, 'User is already a premium user');
            }
            const subscription_url = process.env.PAYSTACK_SUBSCRIPTION_URL;
            if (!subscription_url) {
                throw new CustomError(500, 'Subscription URL not found');
            }
            res.status(200).json(makeResponse(true, 'Subscription URL generated', { subscription_url }));
        }
        catch (error) {
            next(error);
        }
    }
}
