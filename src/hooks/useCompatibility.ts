"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import type { BloodGroup } from "@/types";

// Standard clinical RBC (Red Blood Cell) compatibility rules
export const RBC_DONOR_RULES: Record<BloodGroup, BloodGroup[]> = {
  O_NEGATIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE",
    "AB_NEGATIVE",
    "AB_POSITIVE",
  ],
  O_POSITIVE: ["O_POSITIVE", "A_POSITIVE", "B_POSITIVE", "AB_POSITIVE"],
  A_NEGATIVE: ["A_NEGATIVE", "A_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],
  A_POSITIVE: ["A_POSITIVE", "AB_POSITIVE"],
  B_NEGATIVE: ["B_NEGATIVE", "B_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],
  B_POSITIVE: ["B_POSITIVE", "AB_POSITIVE"],
  AB_NEGATIVE: ["AB_NEGATIVE", "AB_POSITIVE"],
  AB_POSITIVE: ["AB_POSITIVE"],
};

export const RBC_RECIPIENT_RULES: Record<BloodGroup, BloodGroup[]> = {
  O_NEGATIVE: ["O_NEGATIVE"],
  O_POSITIVE: ["O_NEGATIVE", "O_POSITIVE"],
  A_NEGATIVE: ["O_NEGATIVE", "A_NEGATIVE"],
  A_POSITIVE: ["O_NEGATIVE", "O_POSITIVE", "A_NEGATIVE", "A_POSITIVE"],
  B_NEGATIVE: ["O_NEGATIVE", "B_NEGATIVE"],
  B_POSITIVE: ["O_NEGATIVE", "O_POSITIVE", "B_NEGATIVE", "B_POSITIVE"],
  AB_NEGATIVE: ["O_NEGATIVE", "A_NEGATIVE", "B_NEGATIVE", "AB_NEGATIVE"],
  AB_POSITIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE",
    "AB_NEGATIVE",
    "AB_POSITIVE",
  ],
};

export function useBloodGroupCompatibility(bloodGroup: BloodGroup | null) {
  const donorQuery = useQuery({
    queryKey: ["compatibility-recipients", bloodGroup],
    queryFn: async () => {
      if (!bloodGroup) return [];
      const res = await publicService.checkBloodCompatibility({
        donorBloodGroup: bloodGroup,
      });
      return (
        res.data?.compatibleRecipientBloodGroups ??
        res.data?.canDonateTo ??
        RBC_DONOR_RULES[bloodGroup]
      );
    },
    enabled: !!bloodGroup,
    placeholderData: bloodGroup ? RBC_DONOR_RULES[bloodGroup] : [],
  });

  const recipientQuery = useQuery({
    queryKey: ["compatibility-donors", bloodGroup],
    queryFn: async () => {
      if (!bloodGroup) return [];
      const res = await publicService.checkBloodCompatibility({
        recipientBloodGroup: bloodGroup,
      });
      return (
        res.data?.compatibleDonorBloodGroups ??
        res.data?.canReceiveFrom ??
        RBC_RECIPIENT_RULES[bloodGroup]
      );
    },
    enabled: !!bloodGroup,
    placeholderData: bloodGroup ? RBC_RECIPIENT_RULES[bloodGroup] : [],
  });

  return {
    canDonateTo: donorQuery.data ?? (bloodGroup ? RBC_DONOR_RULES[bloodGroup] : []),
    canReceiveFrom:
      recipientQuery.data ?? (bloodGroup ? RBC_RECIPIENT_RULES[bloodGroup] : []),
    isLoading: donorQuery.isLoading || recipientQuery.isLoading,
    isError: donorQuery.isError || recipientQuery.isError,
  };
}

export function usePairwiseCompatibility(
  donor: BloodGroup | null,
  recipient: BloodGroup | null
) {
  return useQuery({
    queryKey: ["pairwise-compatibility", donor, recipient],
    queryFn: async () => {
      if (!donor || !recipient) return null;
      try {
        const res = await publicService.checkBloodCompatibility({
          donorBloodGroup: donor,
          recipientBloodGroup: recipient,
        });
        return {
          compatible:
            res.data?.compatible ??
            RBC_DONOR_RULES[donor]?.includes(recipient) ??
            false,
          reason: res.data?.reason,
          requiresMedicalCrossmatch: res.data?.requiresMedicalCrossmatch ?? true,
        };
      } catch {
        const isComp = RBC_DONOR_RULES[donor]?.includes(recipient) ?? false;
        return {
          compatible: isComp,
          reason: isComp
            ? `${donor.replace("_", " ")} red blood cells are clinically compatible with ${recipient.replace("_", " ")} recipients.`
            : `${donor.replace("_", " ")} red blood cells contain incompatible antigens for ${recipient.replace("_", " ")} recipients.`,
          requiresMedicalCrossmatch: true,
        };
      }
    },
    enabled: !!donor && !!recipient,
    placeholderData:
      donor && recipient
        ? {
            compatible: RBC_DONOR_RULES[donor]?.includes(recipient) ?? false,
            reason: (RBC_DONOR_RULES[donor]?.includes(recipient) ?? false)
              ? `${donor.replace("_", " ")} is clinically compatible with ${recipient.replace("_", " ")}.`
              : `${donor.replace("_", " ")} is incompatible with ${recipient.replace("_", " ")}.`,
            requiresMedicalCrossmatch: true,
          }
        : null,
  });
}
