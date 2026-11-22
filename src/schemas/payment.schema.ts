import { z } from "zod";

export const contributionSchema = z.object({
  amount: z.coerce.number().positive("Contribution amount must be greater than 0"),
  provider: z.enum(["SSLCOMMERZ", "STRIPE"] as const),
  currency: z.enum(["BDT", "USD"] as const),
  paymentPurpose: z.enum(["PLATFORM_SUPPORT", "CAMPAIGN_DONATION", "OTHER"] as const),
  description: z.string().max(255, "Description cannot exceed 255 characters").optional(),
});

export type ContributionFormData = z.infer<typeof contributionSchema>;
