import { z } from "zod";

export const weatherAdvisorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(8, "At least 8 characters long")
    .max(50, "Maximum of 50 characters only"),
  details: z
    .string()
    .trim()
    .min(1, "Details are required")
    .min(60, "Too short message")
    .max(2500, "Maximum of 2500 characters only"),

  dateTime: z.string().min(1, "Date & Time is required"),
  added_by: z.string(),
});

export const roadAdvisorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(8, "At least 8 characters long")
    .max(50, "Maximum of 50 characters only"),

  details: z
    .string()
    .trim()
    .min(1, "Details are required")
    .min(60, "Too short message")
    .max(1000, "Maximum of 1000 characters only"),

  status: z.string().min(1, "Status is required"),

  dateTime: z.string().min(1, "Date & Time is required"),
  added_by: z.string(),
});

export const disasterUpdatesSchema = z.object({
  image: z
    .any()
    .refine((file: FileList | undefined) => file && file.length > 0, {
      message: "Image is required",
    })
    .refine(
      (file: FileList | undefined) => {
        if (!file || file.length === 0) return true;
        const acceptedTypes = ["image/png", "image/jpeg"];
        return acceptedTypes.includes(file[0].type);
      },
      {
        message: "Only PNG or JPEG images are allowed",
      },
    ),

  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(8, "At least 8 characters long")
    .max(50, "Maximum of 50 characters only"),

  details: z
    .string()
    .trim()
    .min(1, "Details are required")
    .min(60, "Too short message")
    .max(2500, "Maximum of 2500 characters only"),

  dateTime: z.string().min(1, "Date & Time is required"),

  disasterType: z.string().min(1, "Disaster Type is required"),
  added_by: z.string(),
});

export const communityNoticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(8, "At least 8 characters long")
    .max(50, "Maximum of 50 characters only"),
  details: z
    .string()
    .trim()
    .min(1, "Details are required")
    .min(60, "Too short message")
    .max(2500, "Maximum of 2500 characters only"),

  dateTime: z.string().min(1, "Date & Time is required"),
  added_by: z.string(),
});

// EDIT DISASTER SCHEMA

export const disasterUpdatesEditSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(8, "At least 8 characters long")
    .max(50, "Maximum of 50 characters only"),

  disasterType: z.string().min(1, "Disaster Type is required"),

  details: z
    .string()
    .trim()
    .min(1, "Details are required")
    .min(60, "Too short message")
    .max(1000, "Maximum of 1000 characters only"),

  dateTime: z.string().min(1, "Date & Time is required"),

  added_by: z.string(),

  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || (file instanceof FileList && file.length === 0))
          return true;
        const allowedTypes = ["image/jpeg", "image/png"];
        const fileToCheck = file instanceof FileList ? file[0] : file;
        return allowedTypes.includes(fileToCheck.type);
      },
      { message: "Only PNG or JPEG images are allowed" },
    ),
});
