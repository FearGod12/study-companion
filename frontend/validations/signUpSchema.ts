 import { z } from "zod";
 
 export const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address.").min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    password: z.string()
      .min(6, "Password must be at least 6 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string(),
    category: z.string().min(1, "Category is required"),
  address: z.string().min(1, "Address is required"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"], 
  });