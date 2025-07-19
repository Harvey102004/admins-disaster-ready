import { z } from "zod";

export const evacuationCenterSchema = z
  .object({
    evac_name: z
      .string()
      .trim()
      .min(1, "Evacuation name is required")
      .min(8, "At least 8 characters long")
      .max(100, "Maximum of 100 characters only"),

    evac_capacity: z
      .string()
      .min(1, "Evacuation capacity is required")
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), { message: "Must be a number" })
      .refine((val) => val <= 5000, {
        message: "Maximum of 5000 capacity only",
      }),

    evac_location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .min(8, "At least 8 characters long")
      .max(100, "Maximum of 100 characters only"),

    evac_evacuees: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), { message: "Must be a number" }),

    evac_contact_person: z
      .string()
      .trim()
      .min(1, "Contact person is required")
      .min(8, "At least 8 characters long")
      .max(100, "Maximum of 100 characters only"),

    evac_contact_number: z
      .string()
      .min(1, "Contact person is required")
      .min(11, "Phone number must be 11 digits")
      .max(11, "Phone number must be 11 digits")
      .regex(/^09\d{9}$/, "Invalid phone number format"),

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
  })
  .refine((data) => data.evac_evacuees <= data.evac_capacity, {
    path: ["evac_evacuees"],
    message: "Evacuees must not exceed the capacity",
  });

export const editEvacuationCenterSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),

    capacity: z.coerce
      .number()
      .min(1, { message: "Capacity must be at least 1" })
      .refine((val) => !isNaN(val), { message: "Capacity must be a number" }),

    location: z.string().min(1, { message: "Location is required" }),

    current_evacuees: z.coerce
      .number()
      .min(0, { message: "Evacuees cannot be negative" })
      .refine((val) => !isNaN(val), { message: "Evacuees must be a number" }),

    contact_person: z
      .string()
      .trim()
      .min(1, "Contact person is required")
      .min(8, "At least 8 characters long")
      .max(100, "Maximum of 100 characters only"),

    contact_number: z
      .string()
      .min(1, "Contact number is required")
      .min(11, "Phone number must be 11 digits")
      .max(11, "Phone number must be 11 digits")
      .regex(/^09\d{9}$/, "Invalid phone number format"),

    lat: z.coerce
      .number()
      .refine((val) => !isNaN(val), { message: "Latitude must be a number" }),

    long: z.coerce
      .number()
      .refine((val) => !isNaN(val), { message: "Longitude must be a number" }),
  })
  .refine((data) => data.current_evacuees <= data.capacity, {
    path: ["current_evacuees"],
    message: "Evacuees must not exceed the capacity",
  });

export type EditEvacuationCenterSchema = z.infer<
  typeof editEvacuationCenterSchema
>;
