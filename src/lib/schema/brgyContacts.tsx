import { z } from "zod";

export const brgyContactSchema = z.object({
  barangay: z.string().min(1, "Barangay is required"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  captain: z
    .string()
    .trim()
    .min(1, "Barangay Captain is required")
    .min(5, "At least 5 characters long")
    .max(100, "Maximum of 100 characters only"),

  secretary: z
    .string()
    .trim()
    .min(1, "Barangay Secretary is required")
    .min(5, "At least 5 characters long")
    .max(100, "Maximum of 100 characters only"),

  facebook: z
    .string()
    .url("Invalid Facebook link")
    .optional()
    .or(z.literal("")), // allow empty string if not required

  landline: z
    .string()
    .min(1, "Barangay Landline is required")
    .regex(/^(\d{7}|\d{3}-\d{3}-\d{4}|\d{10,11})$/, {
      message: "Invalid landline format (e.g. 0491234567)",
    }),

  contact: z
    .string()
    .min(1, "Barangay Contact Number is required")
    .regex(/^09\d{9}$/, "Contact number must start with 09 and be 11 digits"),

  lat: z
    .number({ invalid_type_error: "Latitude is required" })
    .refine((val) => val !== 14.17, {
      message: "Please select a location on the map",
    }),

  long: z
    .number({ invalid_type_error: "Longitude is required" })
    .refine((val) => val !== 121.241, {
      message: "Please select a location on the map",
    }),
});
