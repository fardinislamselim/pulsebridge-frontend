import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicService } from "@/services/public.service";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RequestRespondCta } from "@/components/public/RequestRespondCta";
import {
  Building2,
  Calendar,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await publicService.getPublicBloodRequestById(id);
    const req = res.data;
    const shortId = id.slice(-6).toUpperCase();
    return {
      title: `${req.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")} Blood Needed for ${req.patientName} (Case #${shortId}) | PulseBridge`,
      description: `Urgent ${req.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")} blood needed at ${req.hospitalName}, ${req.city}, ${req.district}. Units needed: ${req.unitsNeeded}.`,
    };
  } catch {
    return {
      title: "Blood Request Details | PulseBridge",
      description: "View verified blood request details and connect with patient coordinators.",
    };
  }
}

export default async function PublicBloodRequestDetailsPage({ params }: PageProps) {
  const { id } = await params;
  let request;

  try {
    const res = await publicService.getPublicBloodRequestById(id);
    request = res.data;
  } catch {
    notFound();
  }

  if (!request) notFound();

  const unitsNeeded = request.unitsNeeded || 1;
  const unitsFulfilled = request.unitsFulfilled || 0;
  const progressPercent = Math.min(100, Math.round((unitsFulfilled / unitsNeeded) * 100));

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl space-y-6">
      <Link
        href="/blood-requests"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blood Requests
      </Link>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Case #{request.id.slice(-6).toUpperCase()}
              </span>
              <StatusBadge status={request.urgency} size="sm" />
              <StatusBadge status={request.status} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {request.patientName}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{request.city}, {request.district}</span>
            </div>
          </div>
          <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">Fulfillment Progress</span>
            <span className="text-slate-900 dark:text-white font-bold">
              {unitsFulfilled} of {unitsNeeded} Units ({progressPercent}%)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all ${
 progressPercent >= 100 ? "bg-emerald-500" : progressPercent > 0 ? "bg-amber-500" : "bg-red-500"
 }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hospital & Location</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{request.hospitalName}</div>
                  <div className="text-slate-500 dark:text-slate-400">{request.hospitalAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  Needed by: <strong className="font-semibold">{new Date(request.neededAt).toLocaleDateString()}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coordinator & Contact</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  Coordinator: <strong className="font-semibold">{request.contactName || "Family Coordinator"}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                {request.contactPhone ? (
                  <a href={`tel:${request.contactPhone}`} className="font-mono font-semibold text-red-600 hover:underline dark:text-red-400">
                    {request.contactPhone}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 italic">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    Available after matching with requester
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {(request.reason || request.additionalNotes) && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Context</h2>
            {request.reason && <p className="text-slate-600 dark:text-slate-300"><strong>Reason:</strong> {request.reason}</p>}
            {request.additionalNotes && <p className="text-slate-500 italic">&ldquo;{request.additionalNotes}&rdquo;</p>}
          </div>
        )}

        {/* Role-Aware Dynamic CTA */}
        <RequestRespondCta requestId={request.id} />
      </div>
    </div>
  );
}
