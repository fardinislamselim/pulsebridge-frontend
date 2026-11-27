# PulseBridge — Blood Donation & Emergency Coordination Platform (Frontend)

PulseBridge is a clinical-grade, flat border-first web application built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** to connect patients, verified voluntary blood donors, and hospitals in real time.

---

## 1. Project Overview

During medical emergencies, every minute counts. PulseBridge replaces fragmented social-media appeals with a structured, medically governed coordination platform:

- **Clinical-Grade, Flat Border-First UI:** High-contrast typography, clean `1px` structural borders, crisp status badges, and responsive layouts built with **Tailwind CSS** and **shadcn/ui** (`@base-ui/react` primitives) for rapid scanning under pressure.
- **Server-First Architecture:** Public directories and landing views render via **Next.js 15 App Router Server Components**, while interactive dashboards, multi-step wizards, and real-time mutations are powered by **TanStack Query v5** and **Zustand v5**.
- **Edge-Protected 3-Role Portals:** Next.js Edge Middleware (`src/middleware.ts`) enforces cookie-backed role-based access control across **Requester** (`/requester`), **Donor** (`/donor`), and **Admin** (`/admin`) workspaces, paired with an Axios interceptor (`src/lib/axios.ts`) that handles concurrent `401` JWT refresh token rotation seamlessly.

---

## 2. Live Links & Repositories

| Resource | URL |
| :--- | :--- |
| **Live Website (Frontend)** | https://pulsebridge-frontend.vercel.app |
| **Live Blood Requests Feed** | https://pulsebridge-frontend.vercel.app/blood-requests |
| **Live Backend API** | https://pulse-bridge-backend.vercel.app/api/v1 |
| **Swagger API Documentation** | https://pulse-bridge-backend.vercel.app/api-docs/ |
| **Database ERD Diagram (DrawSQL)** | https://drawsql.app/teams/fardin-islam/diagrams/pulsebridge |
| **Frontend GitHub Repository** | https://github.com/fardinislamselim/pulsebridge-frontend |
| **Backend GitHub Repository** | https://github.com/fardinislamselim/pulsebridge-backend |

---

## 3. Demo Evaluation Accounts (One-Click Demo Login)

The `/login` page includes **1-Click Demo Login** buttons (`src/components/auth/DemoLoginButtons.tsx`) pre-configured for immediate evaluation against the seeded database:

| Role | Email | Password | Portal Redirect |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pulsebridge.com` | `AdminSecurePassword123!` | `/admin` |
| **Requester** | `recipient.alice@pulsebridge.com` | `DemoPassword123!` | `/requester` |
| **Donor (O+)** | `donor.john@pulsebridge.com` | `DemoPassword123!` | `/donor` |

---

## 4. Core Features & 3-Role Portal Workflows

### Public Experience
- **Homepage (`/`):** 24/7 emergency coordination banner, hero call-to-action, how-it-works workflow, featured verified donors, quick compatibility widget, and eligibility FAQ.
- **Approved Blood Requests Feed (`/blood-requests` & `/blood-requests/[id]`):** Filterable live directory of admin-approved hospital appeals by blood group, urgency (`NORMAL`, `URGENT`, `EMERGENCY`), and district, with unit fulfillment progress.
- **Verified Donor Directory (`/donors`):** Searchable directory of verified voluntary donors with blood group badges, availability indicators, and location filters.
- **Interactive ABO/Rh Compatibility Matrix (`/compatibility`):** Real-time red blood cell donor-to-recipient compatibility lookup across all 8 ABO/Rh blood groups.
- **Voluntary Platform Support (`/dashboard/support-us` & `/payment`):** Voluntary platform support and campaign contributions via **SSLCommerz (BDT)** and **Stripe (USD)**, complete with `/payment/success` and `/payment/cancel` verification flows.

### Requester Portal (`/requester`)
- **Multi-Step Blood Request Wizard (`/requester/requests/new`):** Guided 3-step creation flow covering patient details, hospital & geolocation details, and urgency tier.
- **Fulfillment Progress & Audit Timeline (`/requester/requests` & `/requester/requests/[id]`):** Track `fulfilledUnits / unitsRequired` progress bars, inspect matched compatible donors, edit or cancel appeals, and view request lifecycle history.
- **Hospital Donation Logging (`/requester/donations/log`):** Log completed hospital blood donations against active requests for administrative verification.

### Donor Portal (`/donor`)
- **Availability Toggle (`/donor`):** One-click toggle to mark readiness for emergency appeals (automatically locked while a medical cooldown is active).
- **Automated 90-Day Medical Cooldown Tracker:** Live countdown card (`CooldownStatusCard`) displaying eligibility status, last donation date, and next eligible donation date (`eligibleAt`).
- **Donation History & Profile (`/donor/history` & `/donor/profile`):** Paginated history of verified/pending donations and donor location/blood group profile management.

### Admin Command Center (`/admin`)
- **Platform Overview & Analytics (`/admin`):** Real-time KPI cards, Recharts visualizations, and recent system activity feeds.
- **Blood Request Moderation (`/admin/requests`):** Approve, reject, update urgency, or expire submitted blood requests.
- **Atomic Hospital Donation Verification (`/admin/donations`):** Verify or reject logged donations—atomically updating request fulfillment units and initiating the donor's 90-day medical cooldown.
- **User Governance (`/admin/users`):** Manage user statuses (`ACTIVE`, `BLOCKED`) and role assignments.
- **Payment Audits (`/admin/payments`):** Inspect SSLCommerz/Stripe transactions, verify receipts, and process refunds.

---

## 5. Tech Stack & Folder Structure

### Technology Stack
- **Framework:** Next.js (`^15.5.29`, App Router, Server Components first), React (`^19.0.0`), TypeScript (`^5.7.3`)
- **Styling & UI:** Tailwind CSS (`^3.4.17`), `tailwindcss-animate`, shadcn/ui (`@base-ui/react`), `lucide-react`, `sonner`
- **Data Fetching & Caching:** TanStack Query (`@tanstack/react-query ^5.64.2`), Axios (`^1.7.9`) with 401 refresh queue
- **State & Forms:** Zustand (`^5.0.3`) with persisted auth state & cookie sync, React Hook Form (`^7.92.0`) + Zod (`^3.24.1`)
- **Auth & Visualization:** Google OAuth (`@react-oauth/google`), `js-cookie`, Recharts (`^3.11.0`)

### `src/` Folder Structure

```text
pulsebridge-frontend/
├── public/                       # Static SVG assets
└── src/
    ├── app/
    │   ├── (auth)/               # Login, Register, Verify Email & Forgot Password pages
    │   ├── (dashboard)/          # Protected 3-role portals (/admin, /donor, /requester, /dashboard)
    │   ├── (public)/             # Public pages (/, /blood-requests, /donors, /compatibility, /about, /contact)
    │   ├── payment/              # Payment initiation, /payment/success & /payment/cancel
    │   ├── globals.css           # Tailwind CSS theme & design tokens
    │   └── layout.tsx            # Root layout & providers
    ├── components/
    │   ├── admin/                # Admin dashboard, charts, moderation & governance tables
    │   ├── auth/                 # LoginForm, DemoLoginButtons, GoogleLoginButton, RegisterForm, OTP forms
    │   ├── donor/                # AvailabilityToggleCard, CooldownStatusCard, DonationHistoryTable
    │   ├── layout/               # Navbar, DashboardSidebar, DashboardHeader, Footer, MobileNavSheet
    │   ├── payment/              # VoluntaryContributionForm, MyPaymentsTable, PaymentSuccessClient
    │   ├── profile/              # ProfileUpdateForm & ActiveSessionsList
    │   ├── public/               # HeroSection, BloodRequestCard, DonorCard, Compatibility Matrix
    │   ├── requester/            # 3-step CreateBloodRequestWizard, MatchedDonorsGrid, LogDonationForm
    │   ├── shared/               # BloodGroupBadge, StatusBadge, StatCard, UrlPagination, Skeletons
    │   └── ui/                   # Reusable shadcn/ui primitives
    ├── constants/                # Bangladesh districts & domain constants
    ├── hooks/                    # TanStack Query hooks (useAdmin, useBloodRequests, useDonor, usePayments, etc.)
    ├── lib/                      # Axios client with 401 token refresh queue & cn() utility
    ├── providers/                # TanStack QueryClientProvider
    ├── schemas/                  # Zod form validation schemas
    ├── services/                 # Typed API service modules (auth, blood-request, donor, donation, matching, payment, admin, user, public)
    ├── store/                    # Zustand authStore (tokenStorage + Edge cookie sync)
    ├── types/                    # Shared TypeScript interfaces & API response types
    └── middleware.ts             # Next.js Edge Middleware for RBAC & route protection
```

---

## 6. Local Setup & Environment Variables

### Prerequisites
- **Node.js** `>= 20`
- **pnpm**

### Step-by-Step Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   Create `.env.local` in the project root (you can start from `.env.example`):
   ```env
   NEXT_PUBLIC_API_URL=https://pulse-bridge-backend.vercel.app/api/v1
   NEXT_PUBLIC_APP_NAME=PulseBridge
   ```
   > For local backend development, set `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`.

3. **Run the development server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Additional Scripts
- `pnpm run build` — Build production bundle
- `pnpm run start` — Start production Next.js server
- `pnpm run lint` — Run ESLint checks
- `pnpm run type-check` — Run `tsc --noEmit`
