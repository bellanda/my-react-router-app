import * as React from "react";
import { cva } from "class-variance-authority";
import { Link, NavLink } from "react-router";
import { cn } from "../../lib/utils";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:data-[active]:bg-slate-800/50 dark:data-[state=open]:bg-slate-800/50"
);

interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  children: React.ReactNode;
  to: string;
}

export function NavigationMenuLink({ className, to, active, children, ...props }: NavigationMenuLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(navigationMenuTriggerStyle(), isActive && "bg-slate-100/50 dark:bg-slate-800/50", className)}
      {...props}
    >
      {children}
    </NavLink>
  );
}

interface NavigationMenuProps {
  children: React.ReactNode;
  className?: string;
}

export function NavigationMenu({ children, className }: NavigationMenuProps) {
  return <nav className={cn("flex items-center space-x-2", className)}>{children}</nav>;
}
