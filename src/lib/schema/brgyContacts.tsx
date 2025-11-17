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
      .min(5, "Must be at least 5 characters long")
      .max(100, "Maximum of 100 characters only"),

    secretary_name: z
      .string()
      .trim()
      .min(5, "Must be at least 5 characters long")
      .max(100, "Maximum of 100 characters only"),

    contact_number: z
      .string()
      .trim()
      .min(1, "Barangay contact number is required")
      .regex(/^09\d{9}$/, "Contact number must start with 09 and be 11 digits"),

    landline: z
      .string()
      .trim()
      .min(1, "Landline is required")
      .regex(
        /^[0-9\s-]+$/,
        "Landline can only contain numbers, spaces, or dashes",
      ),

    facebook_page: z
      .string()
      .trim()
      .min(1, "Facebook page is required")
      .url("Must be a valid URL")
      .refine(
        (val) => val.startsWith("https://www.facebook.com/"),
        'Facebook page must start with "https://www.facebook.com/"',
      ),

    lat: z
      .number({ invalid_type_error: "Latitude is required" })
      .refine((val) => !isNaN(val), "Latitude must be a valid number"),

    long: z
      .number({ invalid_type_error: "Longitude is required" })
      .refine((val) => !isNaN(val), "Longitude must be a valid number"),

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
