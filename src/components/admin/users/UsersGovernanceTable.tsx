"use client";

import React, { useState } from "react";
import { useAdminUsers, useUpdateUserStatus, useUpdateUserRole } from "@/hooks/useAdminGovernance";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UsersIcon, ShieldAlertIcon, CheckCircle2Icon } from "lucide-react";
import type { User, UserRole, UserStatus } from "@/types";

export function UsersGovernanceTable() {
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const { data: users, isLoading } = useAdminUsers(
    roleFilter !== "ALL" ? { role: roleFilter } : undefined
  );
  const updateStatusMutation = useUpdateUserStatus();
  const updateRoleMutation = useUpdateUserRole();

  const filteredUsers = (users || []).filter((u: User) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          {["ALL", "USER", "REQUESTER", "DONOR", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                roleFilter === r
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} columns={5} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={UsersIcon}
              title="No Users Found"
              description="No user accounts match your search query or role filter criteria."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user: User) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-slate-400 font-mono">ID: {user.id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-800 dark:text-slate-200">{user.email}</div>
                      <div className="text-xs text-slate-400">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={user.role}
                        disabled={updateRoleMutation.isPending}
                        onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value as UserRole })}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="USER">USER</option>
                        <option value="REQUESTER">REQUESTER</option>
                        <option value="DONOR">DONOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: user.id,
                            status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          user.status === "ACTIVE"
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                        }`}
                      >
                        {user.status === "ACTIVE" ? (
                          <>
                            <ShieldAlertIcon className="h-3.5 w-3.5" /> Block
                          </>
                        ) : (
                          <>
                            <CheckCircle2Icon className="h-3.5 w-3.5" /> Unblock
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
