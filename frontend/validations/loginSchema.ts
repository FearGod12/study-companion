 import { z } from "zod";
 
 export const loginSchema = z.object({
    email: z.string().email("Invalid email address.").min(1, "Email is required"),
    password: z.string()
      .min(6, "Password must be at least 6 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
  });
