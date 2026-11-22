import { z } from "zod";

export const donorRestrictionSchema = z.object({
  hasMedicalRestriction: z.boolean(),
  medicalRestrictionReason: z
    .string()
    .trim()
    .max(500, "Reason cannot exceed 500 characters")
    .optional(),
}).refine((data) => {
  if (data.hasMedicalRestriction && (!data.medicalRestrictionReason || data.medicalRestrictionReason.length < 5)) {
    return false;
  }
  return true;
}, {
  message: "A detailed clinical reason (at least 5 characters) is required when imposing restrictions",
  path: ["medicalRestrictionReason"],
});

export type DonorRestrictionFormData = z.infer<typeof donorRestrictionSchema>;

export const refundPaymentSchema = z.object({
  amount: z.coerce.number().positive("Refund amount must be positive"),
  reason: z
    .string()
    .trim()
    .min(3, "Refund reason must be at least 3 characters")
    .max(500, "Refund reason cannot exceed 500 characters"),
});

export type RefundPaymentFormData = z.infer<typeof refundPaymentSchema>;
