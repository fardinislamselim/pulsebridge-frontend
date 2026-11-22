import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "PulseBridge | Blood Donation & Emergency Coordination Platform",
    template: "%s | PulseBridge",
  },
  description:
    "PulseBridge connects blood donors, recipients, and hospitals with real-time ABO/Rh matching, emergency response coordination, and transparent verification.",
  keywords: [
    "Blood Donation",
    "Emergency Blood",
    "Blood Bank",
    "PulseBridge",
    "ABO Compatibility",
    "Donor Registry",
    "Bangladesh Blood Donors",
  ],
  authors: [{ name: "PulseBridge Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
