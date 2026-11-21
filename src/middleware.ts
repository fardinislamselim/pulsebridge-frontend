import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token and user role from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  const isAuthenticated = Boolean(accessToken);

  // Helper for role dashboard destinations
  const getRoleDashboard = (role?: string) => {
    switch (role) {
      case "REQUESTER":
        return "/requester";
      case "DONOR":
        return "/donor";
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/admin";
      default:
        return "/login";
    }
  };

  // 1. Guest-only Routes: Redirect logged-in users away from /login & /register
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (isAuthRoute) {
    if (isAuthenticated) {
      const redirectUrl = new URL(getRoleDashboard(userRole), request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // 2. Generic /dashboard root redirect to role-specific dashboard
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (!isAuthenticated) {
      const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
    const targetDashboard = getRoleDashboard(userRole);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 3. Protected Route Checks
  const isRequesterRoute = pathname.startsWith("/requester");
  const isDonorRoute = pathname.startsWith("/donor");
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardSubRoute = pathname.startsWith("/dashboard/");

  const isProtectedRoute =
    isRequesterRoute || isDonorRoute || isAdminRoute || isDashboardSubRoute;

  if (isProtectedRoute) {
    // If not authenticated, redirect to login with return path
    if (!isAuthenticated) {
      const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Control (RBAC)
    if (isRequesterRoute) {
      // Requesters, Admins, and Super Admins can access requester routes
      const hasPermission =
        userRole === "REQUESTER" ||
        userRole === "ADMIN" ||
        userRole === "SUPER_ADMIN";

      if (!hasPermission) {
        // Redirect unauthorized roles to their respective home
        return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
      }
    }

    if (isDonorRoute) {
      // Donors, Admins, and Super Admins can access donor routes
      const hasPermission =
        userRole === "DONOR" ||
        userRole === "ADMIN" ||
        userRole === "SUPER_ADMIN";

      if (!hasPermission) {
        return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
      }
    }

    if (isAdminRoute) {
      // Only ADMIN and SUPER_ADMIN can access admin routes
      const hasPermission = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

      if (!hasPermission) {
        return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/requester/:path*",
    "/donor/:path*",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
