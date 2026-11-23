import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { donationService, type CreateDonationPayload } from "@/services/donation.service";
import { bloodRequestKeys } from "@/hooks/useBloodRequests";

export function useCreateDonation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDonationPayload) =>
      donationService.createDonation(payload),
    onSuccess: (res, variables) => {
      toast.success(
        res.message ||
          "Donation record logged successfully! Status set to PENDING verification."
      );
      queryClient.invalidateQueries({
        queryKey: bloodRequestKeys.detail(variables.bloodRequestId),
      });
      queryClient.invalidateQueries({
        queryKey: bloodRequestKeys.history(variables.bloodRequestId),
      });
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      queryClient.invalidateQueries({ queryKey: ["my-donations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });

      if (variables.bloodRequestId) {
        router.push(`/requester/requests/${variables.bloodRequestId}`);
      } else {
        router.push("/requester");
      }
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        "Failed to log donation. Please verify Donor ID and Request ID.";
      toast.error(msg);
    },
  });
}
