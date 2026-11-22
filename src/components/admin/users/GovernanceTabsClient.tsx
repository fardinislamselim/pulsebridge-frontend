"use client";

import React, { useState } from "react";
import { UsersGovernanceTable } from "./UsersGovernanceTable";
import { DonorsGovernanceTable } from "./DonorsGovernanceTable";
import { UsersIcon, HeartHandshakeIcon } from "lucide-react";

export function GovernanceTabsClient() {
  const [activeTab, setActiveTab] = useState<"users" | "donors">("users");

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "users"
              ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <UsersIcon className="h-4 w-4" />
          <span>All Platform Users</span>
        </button>

        <button
          onClick={() => setActiveTab("donors")}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === "donors"
              ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <HeartHandshakeIcon className="h-4 w-4" />
          <span>Donor Verification & Medical Restrictions</span>
        </button>
      </div>

      <div>
        {activeTab === "users" ? (
          <UsersGovernanceTable />
        ) : (
          <DonorsGovernanceTable />
        )}
      </div>
    </div>
  );
}
