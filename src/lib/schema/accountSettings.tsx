import { z } from "zod";

// Schema for updating profile
export const updateProfileSchema = z.object({
  action: z.literal("updateProfile"),
  id: z.number(),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(8, "Username must be at least 8 characters")
    .max(50, "Username cannot exceed 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(80, "Email cannot exceed 80 characters")
    .email("Invalid email format"),
  password: z
    .string()
    .trim()
    .min(1, "Current password is required")
    .max(100, "Password cannot exceed 100 characters"),
});

// Schema for changing password
export const changePasswordSchema = z.object({
  action: z.literal("changePassword"),
  id: z.string(),
  currentPassword: z
    .string()
    .trim()
    .min(1, "Current password is required")
    .max(100, "Password cannot exceed 100 characters"),
  newPassword: z
    .string()
    .trim()
    .min(1, "New password is required")
    .max(100, "Password cannot exceed 100 characters"),
});
