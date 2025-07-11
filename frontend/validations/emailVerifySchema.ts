import { z } from 'zod';

export const emailVerifySchema = z.object({
  otp: z.array(z.string().length(1, 'Each OTP field must be 1 character')),
});
