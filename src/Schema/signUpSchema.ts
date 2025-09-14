import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
