"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  donorRestrictionSchema,
  type DonorRestrictionFormData,
} from "@/schemas/governance.schema";
import { useUpdateDonorRestrictions } from "@/hooks/useAdminGovernance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StethoscopeIcon, AlertTriangleIcon } from "lucide-react";
import type { PublicDonor } from "@/types";

interface DonorRestrictionDialogProps {
  donor: PublicDonor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonorRestrictionDialog({
  donor,
  open,
  onOpenChange,
}: DonorRestrictionDialogProps) {
  const updateRestrictionMutation = useUpdateDonorRestrictions();
  const isCurrentlyRestricted = (donor as any)?.hasMedicalRestriction ?? false;
  const currentReason = (donor as any)?.medicalRestrictionReason ?? "";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DonorRestrictionFormData>({
    resolver: zodResolver(donorRestrictionSchema),
    defaultValues: {
      hasMedicalRestriction: isCurrentlyRestricted,
      medicalRestrictionReason: currentReason,
    },
  });

  useEffect(() => {
    if (donor) {
      reset({
        hasMedicalRestriction: (donor as any)?.hasMedicalRestriction ?? false,
        medicalRestrictionReason: (donor as any)?.medicalRestrictionReason ?? "",
      });
    }
  }, [donor, reset]);

  const hasRestriction = watch("hasMedicalRestriction");

  const onSubmit = (values: DonorRestrictionFormData) => {
    if (!donor) return;
    updateRestrictionMutation.mutate(
      {
        id: donor.id,
        payload: {
          hasMedicalRestriction: values.hasMedicalRestriction,
          medicalRestrictionReason: values.hasMedicalRestriction
            ? values.medicalRestrictionReason
            : undefined,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader className="space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <StethoscopeIcon className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Donor Medical Restriction
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Configure clinical eligibility and safety restrictions for donor{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {donor?.user?.name || "Donor"}
            </span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <input
              type="checkbox"
              id="hasMedicalRestriction"
              {...register("hasMedicalRestriction")}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="hasMedicalRestriction" className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">
              Impose Clinical / Medical Restriction
            </label>
          </div>

          {hasRestriction && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Medical Reason / Clinical Justification *
              </label>
              <textarea
                {...register("medicalRestrictionReason")}
                rows={3}
                placeholder="State the clinical contraindication (e.g. low hemoglobin, active infection)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              {errors.medicalRestrictionReason && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.medicalRestrictionReason.message}
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
            <AlertTriangleIcon className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Restricting a donor prevents automated emergency matching algorithms from recommending them.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateRestrictionMutation.isPending}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-sm disabled:opacity-50"
            >
              {updateRestrictionMutation.isPending ? "Updating..." : "Save Restrictions"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
