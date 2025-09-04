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

    facebook_page: z
      .string()
      .trim()
      .min(1, "Facebook page link is required")
      .regex(
        /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/,
        "Please provide a valid Facebook page link",
      ),

    landline: z
      .string()
      .trim()
      .min(1, "Barangay landline is required")
      .regex(
        /^(\d{7}|\d{3}-\d{3}-\d{4}|\d{10,11})$/,
        "Invalid landline format (e.g. 0491234567)",
      ),

    contact_number: z
      .string()
      .trim()
      .min(1, "Barangay contact number is required")
      .regex(/^09\d{9}$/, "Contact number must start with 09 and be 11 digits"),

    lat: z
      .number({ invalid_type_error: "Latitude is required" })
      .refine((val) => val !== 14.1717, {
        message: "Please select a location on the map",
      }),

    long: z
      .number({ invalid_type_error: "Longitude is required" })
      .refine((val) => val !== 121.2436, {
        message: "Please select a location on the map",
      }),
  });
};

export const brgyContactSchema = createSchema();
