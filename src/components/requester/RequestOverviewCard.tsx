import React from "react";
import { Droplet, User, Building2, MapPin, Calendar, Phone, Clock } from "lucide-react";
import type { BloodRequest } from "@/types";

interface RequestOverviewCardProps {
  request: BloodRequest;
}

export function RequestOverviewCard({ request }: RequestOverviewCardProps) {
  const unitsNeeded = request.unitsNeeded || 1;
  const unitsFulfilled = request.unitsFulfilled || 0;
  const fulfillmentPercent = Math.min(100, Math.round((unitsFulfilled / unitsNeeded) * 100));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Patient & Hospital Information
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clinical requirements and hospital coordinates
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {unitsFulfilled} / {unitsNeeded} Units
          </span>
          <span className="ml-1 text-xs text-slate-500">({fulfillmentPercent}%)</span>
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
 fulfillmentPercent >= 100
 ? "bg-emerald-500"
 : fulfillmentPercent > 0
 ? "bg-amber-500"
 : "bg-red-500"
 }`}
          style={{ width: `${fulfillmentPercent}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
          <div>
            <span className="text-slate-400 block font-medium">Patient Name</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {request.patientName}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Building2 className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
          <div>
            <span className="text-slate-400 block font-medium">Hospital</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {request.hospitalName}
            </span>
            <span className="text-slate-500 dark:text-slate-400 block text-xs mt-0.5">
              {request.hospitalAddress}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
          <div>
            <span className="text-slate-400 block font-medium">District & Area</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {request.district}, {request.city}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
          <div>
            <span className="text-slate-400 block font-medium">Needed Deadline</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {new Date(request.neededAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
          <div>
            <span className="text-slate-400 block font-medium">Emergency Contact</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {request.contactName || request.requester?.name || "Primary Contact"}
            </span>
            <a
              href={`tel:${request.contactPhone}`}
              className="text-red-600 dark:text-red-400 font-semibold block text-xs mt-0.5 hover:underline"
            >
              {request.contactPhone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
          <div>
            <span className="text-slate-400 block font-medium">Submitted On</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {(request.additionalNotes || request.reason) && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Clinical Instructions / Notes
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {request.additionalNotes || request.reason}
          </p>
        </div>
      )}
    </div>
  );
}
