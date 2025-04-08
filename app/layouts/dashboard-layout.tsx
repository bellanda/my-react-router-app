import { Bell } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router";

import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { ThemeToggle } from "~/components/ui/theme-toggle";

type DashboardLayoutProps = {
  children?: React.ReactNode;
  showFooter?: boolean;
  showBreadcrumbs?: boolean;
};

// Função para capitalizar a primeira letra
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function DashboardLayout({
  children,
  showFooter = true,
  showBreadcrumbs = true,
}: DashboardLayoutProps) {
  const location = useLocation();

  // Cria um array com os segmentos da rota atual
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Verifica se estamos em uma rota do dashboard
  const isDashboardRoute = pathSegments[0] === "dashboard";

  // Função para criar a URL de cada segmento do breadcrumb
  const getPathUrl = (index: number) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {showBreadcrumbs && (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" prefetch="intent">
                        Home
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {pathSegments.length > 0 && pathSegments[0] !== "" && (
                    <>
                      {pathSegments.map((segment, index) => {
                        // Último segmento é renderizado como BreadcrumbPage
                        const isLast = index === pathSegments.length - 1;

                        return (
                          <React.Fragment key={index}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              {isLast ? (
                                <BreadcrumbPage>
                                  {capitalizeFirstLetter(segment)}
                                </BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink asChild>
                                  <Link
                                    to={getPathUrl(index)}
                                    prefetch="intent"
                                  >
                                    {capitalizeFirstLetter(segment)}
                                  </Link>
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </React.Fragment>
                        );
                      })}
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="bg-background flex flex-1 flex-col gap-2 p-6">
          {children || <Outlet />}
        </div>
        {/* {showFooter && (
          <footer className="border-t py-4 px-6">
            <div className="container mx-auto">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} React Router v7 Demo. All rights reserved.
              </p>
            </div>
          </footer>
        )} */}
      </SidebarInset>
    </SidebarProvider>
  );
}
