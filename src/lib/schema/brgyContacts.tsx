import { z } from "zod";

const createSchema = () => {
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const storedBarangayName = storedUser ? JSON.parse(storedUser).barangay : "";

  return z.object({
    barangay_name: z
      .string()
      .min(1, "Barangay name is required")
      .refine((val) => val === storedBarangayName, {
        message: `Barangay name must match the recorded value: "${storedBarangayName}"`,
      }),

    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Invalid email format"),

    captain_name: z
      .string()
      .trim()
      .min(1, "Barangay Captain name is required")
      .min(5, "Must be at least 5 characters long")
      .max(100, "Maximum of 100 characters only"),

    secretary_name: z
      .string()
      .trim()
      .min(1, "Barangay Secretary name is required")
      .min(5, "Must be at least 5 characters long")
      .max(100, "Maximum of 100 characters only"),

    contact_number: z
      .string()
      .trim()
      .min(1, "Barangay contact number is required")
      .regex(/^09\d{9}$/, "Contact number must start with 09 and be 11 digits"),

    landline: z.string().trim().optional(),

    facebook_page: z.string().trim().optional(),

    lat: z.number(),
    long: z.number(),

    total_male: z
      .string()
      .optional()
      .transform((val) => Number(val) || 0),

    total_female: z
      .string()
      .optional()
      .transform((val) => Number(val) || 0),

    total_families: z
      .string()
      .optional()
      .transform((val) => Number(val) || 0),

    total_male_senior: z
      .string()
      .optional()
      .transform((val) => Number(val) || 0),

    total_female_senior: z
      .string()
      .optional()
      .transform((val) => Number(val) || 0),

    total_0_4_years: z
      .string()
      .optional()
      .transform((val) => Number(val) || 0),

    source: z.string().trim().optional(),
  });
};

export const brgyContactSchema = createSchema();
