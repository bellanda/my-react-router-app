import React from "react";
import { Link, Outlet } from "react-router";

type AuthLayoutProps = {
  children?: React.ReactNode;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkHref?: string;
  logoText?: string;
};

export default function AuthLayout({
  children,
  showBackLink = true,
  backLinkText = "Back to home",
  backLinkHref = "/",
  logoText = "React Router v7",
}: AuthLayoutProps) {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-primary-foreground text-xs font-semibold">
                  R
                </span>
              </div>
              <span className="text-xl font-semibold tracking-tight">
                {logoText}
              </span>
            </Link>
          </div>

          <div className="bg-card w-full rounded-lg border p-6 shadow-sm">
            <Outlet />
          </div>

          {showBackLink && (
            <Link
              to={backLinkHref}
              className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
            >
              {backLinkText}
            </Link>
          )}
        </div>
      </div>
      <footer className="text-muted-foreground absolute bottom-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} React Router v7 Demo. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
