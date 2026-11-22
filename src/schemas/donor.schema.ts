import { z } from "zod";

export const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;

export const updateDonorProfileSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, {
    message: "Please select your blood group",
  }),
  gender: z.string().min(1, "Please select your gender"),
  district: z.string().min(1, "Please select your district"),
  city: z.string().trim().min(2, "City or Upazila must be at least 2 characters"),
  address: z.string().trim().optional().or(z.literal("")),
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Please enter a valid date of birth",
    }),
});

export type UpdateDonorProfileFormValues = z.infer<
  typeof updateDonorProfileSchema
>;
