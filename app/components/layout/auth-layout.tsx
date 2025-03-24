import React from "react";
import { Outlet, Link } from "react-router";

type AuthLayoutProps = {
  children?: React.ReactNode;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkHref?: string;
  logoText?: string;
};

export function AuthLayout({
  children,
  showBackLink = true,
  backLinkText = "Back to home",
  backLinkHref = "/",
  logoText = "React Router v7"
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-semibold">R</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">{logoText}</span>
            </Link>
          </div>

          <div className="w-full bg-card p-6 shadow-sm rounded-lg border">{children || <Outlet />}</div>

          {showBackLink && (
            <Link
              to={backLinkHref}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              {backLinkText}
            </Link>
          )}
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} React Router v7 Demo. All rights reserved.</p>
      </footer>
    </div>
  );
}
