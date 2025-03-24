import React from "react";
import { Outlet, Link, useLocation } from "react-router";
import { MainLayout } from "./main-layout";

type DashboardLayoutProps = {
  children?: React.ReactNode;
  sidebarLinks?: Array<{ label: string; href: string }>;
};

export function DashboardLayout({
  children,
  sidebarLinks = [
    { label: "Overview", href: "/dashboard" },
    { label: "Analytics", href: "/dashboard/analytics" },
    { label: "Settings", href: "/dashboard/settings" }
  ]
}: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-card border rounded-lg shadow-sm p-4">
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const isActive =
                      location.pathname === link.href ||
                      (link.href === "/dashboard" &&
                        location.pathname.startsWith("/dashboard") &&
                        location.pathname === "/dashboard");

                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`block px-4 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted hover:text-foreground/80 font-medium"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-6 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Nested Routes</h3>
                <p className="text-orange-700 dark:text-orange-400 text-sm">
                  This dashboard demonstrates nested routes in React Router v7. The sidebar links to different sections, and the
                  content area displays the corresponding route component.
                </p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3 bg-card border rounded-lg shadow-sm p-6">{children || <Outlet />}</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
