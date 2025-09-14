import { z } from "zod";

export const Cities = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"] as const;
export const propertyTypes = ["Apartment", "Villa", "Plot", "Office", "Retail"] as const;
export const bhk = ["bhk1", "bhk2", "bhk3", "bhk4", "Studio"] as const; // you defined safe names earlier
export const purpose = ["Buy", "Rent"] as const;
export const timelines = ["less than 3 months", "between 3 to 6 months", "more than 6 months", "Exploring"] as const;
export const sources = ["Website", "Referral", "Walkin", "Call", "Other"] as const;

export const buyerLeadSchema = z.object({
  fullName: z.string().min(2, { message: "Fullname must be at least 2 characters" }).max(80, { message: "Fullname must be at most 80 characters" }),

  email: z.string().email({ message: "Invalid email address" }).optional(),

  phone: z
    .string()
    .min(10, { message: "Phone must have at least 10 digits" })
    .max(15, { message: "Phone must have at most 15 digits" })
    .regex(/^[0-9+()\-\s]*$/, { message: "Phone contains invalid characters" }),

  city: z.enum(Cities, { error: "Invalid city" }),

  propertyType: z.enum(propertyTypes, { error: "Invalid property type" }),

  bhk: z.enum(bhk, { error: "Invalid bhk" }).optional(),

  purpose: z.enum(purpose, { error: "Invalid purpose" }),

  budgetMin: z.number().int().positive().optional(),

  budgetMax: z.number().int().positive().optional(),

  timeline: z.enum(timelines, { error: "Invalid timeline" }),

  source: z.enum(sources, { message: "Invalid source" }),

  notes: z.string().max(1000).optional(),
});
