import { useQuery } from "@tanstack/react-query";
import { bloodRequestService } from "@/services/blood-request.service";
import { matchingService, type CompatibilityQueryParams } from "@/services/matching.service";
import { bloodRequestKeys } from "@/hooks/useBloodRequests";

export function useMatchedDonors(requestId: string) {
  return useQuery({
    queryKey: bloodRequestKeys.matchedDonors(requestId),
    queryFn: async () => {
      try {
        const res = await bloodRequestService.getMatchedDonors(requestId);
        return res.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!requestId,
  });
}

export function useBloodCompatibility(params: CompatibilityQueryParams) {
  return useQuery({
    queryKey: ["blood-compatibility", params.donorBloodGroup, params.recipientBloodGroup],
    queryFn: async () => {
      const res = await matchingService.checkCompatibility(params);
      return res.data;
    },
    enabled: !!(params.donorBloodGroup || params.recipientBloodGroup),
  });
}
