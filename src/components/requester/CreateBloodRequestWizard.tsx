"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useCreateBloodRequest } from "@/hooks/useBloodRequests";
import { WizardStepIndicator } from "@/components/requester/WizardStepIndicator";
import { WizardStep1Patient } from "@/components/requester/WizardStep1Patient";
import { WizardStep2Hospital } from "@/components/requester/WizardStep2Hospital";
import { WizardStep3Urgency } from "@/components/requester/WizardStep3Urgency";
import type { BloodGroup, RequestUrgency } from "@/types";

const wizardSchema = z.object({
  patientName: z.string().trim().min(2, "Patient name must be at least 2 characters").max(100),
  bloodGroup: z.string().min(1, "Please select a required blood group"),
  unitsRequired: z.coerce.number().int().min(1, "Minimum 1 unit").max(10, "Maximum 10 units"),
  hospitalName: z.string().trim().min(2, "Hospital name is required").max(150),
  hospitalAddress: z.string().trim().min(3, "Hospital address is required").max(255),
  district: z.string().trim().min(2, "Please select a district"),
  city: z.string().trim().min(2, "City is required").max(100),
  urgency: z.enum(["NORMAL", "URGENT", "EMERGENCY"] as const),
  requiredAt: z.string().min(1, "Required date and time is required"),
  contactPerson: z.string().trim().min(2, "Contact person name is required"),
  contactPhone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Valid phone number required"),
  details: z.string().trim().max(1000).optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

export function CreateBloodRequestWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const createRequestMutation = useCreateBloodRequest();

  const getDefaultDatetime = () => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      patientName: "",
      bloodGroup: "",
      unitsRequired: 1,
      hospitalName: "",
      hospitalAddress: "",
      district: "",
      city: "",
      urgency: "URGENT",
      requiredAt: getDefaultDatetime(),
      contactPerson: "",
      contactPhone: "",
      details: "",
    },
  });

  const selectedBloodGroup = watch("bloodGroup");
  const unitsRequired = watch("unitsRequired");
  const selectedUrgency = watch("urgency") as RequestUrgency;

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger(["patientName", "bloodGroup", "unitsRequired"]);
      if (valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await trigger(["hospitalName", "hospitalAddress", "district", "city"]);
      if (valid) setCurrentStep(3);
    }
  };

  const onSubmit = async (data: WizardFormData) => {
    const isoDate = new Date(data.requiredAt).toISOString();
    await createRequestMutation.mutateAsync({
      patientName: data.patientName,
      bloodGroup: data.bloodGroup as BloodGroup,
      unitsNeeded: data.unitsRequired,
      unitsRequired: data.unitsRequired,
      hospitalName: data.hospitalName,
      hospitalAddress: data.hospitalAddress,
      district: data.district,
      city: data.city,
      urgency: data.urgency,
      neededAt: isoDate,
      requiredAt: isoDate,
      contactPerson: data.contactPerson,
      contactName: data.contactPerson,
      contactPhone: data.contactPhone,
      details: data.details || undefined,
      reason: data.details || undefined,
    });
    router.push("/requester");
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-8">
      <WizardStepIndicator currentStep={currentStep} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <WizardStep1Patient
            register={register}
            setValue={setValue}
            selectedBloodGroup={selectedBloodGroup}
            unitsRequired={unitsRequired}
            errors={errors}
          />
        )}

        {currentStep === 2 && <WizardStep2Hospital register={register} errors={errors} />}

        {currentStep === 3 && (
          <WizardStep3Urgency
            register={register}
            setValue={setValue}
            selectedUrgency={selectedUrgency}
            errors={errors}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : <div />}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition"
            >
              Continue to Step {currentStep + 1}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={createRequestMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 disabled:opacity-70 transition"
            >
              {createRequestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  Submit Blood Request
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
