import React from "react";
import type { Metadata } from "next";
import { RequestDetailsClient } from "@/components/requester/RequestDetailsClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const shortId = id.length > 6 ? id.slice(-6).toUpperCase() : id;
  return {
    title: `Blood Request Case #${shortId} | PulseBridge Blood & Emergency Platform`,
    description: `Track emergency case #${shortId}, discover compatible ABO/Rh donors, and monitor real-time audit milestones.`,
  };
}

/**
 * RequestDetailsPage - Pure Server Component (NO "use client")
 * Resolves asynchronous dynamic route params and mounts RequestDetailsClient.
 */
export default async function RequestDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-7xl mx-auto">
      <RequestDetailsClient requestId={id} />
    </div>
  );
}
