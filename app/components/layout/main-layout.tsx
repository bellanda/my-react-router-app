import React from "react";
import { Outlet, Link, useLocation } from "react-router";
import { ChevronRight } from "lucide-react";

import { AppSidebar } from "~/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

type MainLayoutProps = {
  children?: React.ReactNode;
  showFooter?: boolean;
  showBreadcrumbs?: boolean;
};

// Função para capitalizar a primeira letra
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function MainLayout({ children, showFooter = true, showBreadcrumbs = true }: MainLayoutProps) {
  const location = useLocation();

  // Cria um array com os segmentos da rota atual
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Função para criar a URL de cada segmento do breadcrumb
  const getPathUrl = (index: number) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {showBreadcrumbs && (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
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
                                <BreadcrumbPage>{capitalizeFirstLetter(segment)}</BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink asChild>
                                  <Link to={getPathUrl(index)}>{capitalizeFirstLetter(segment)}</Link>
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
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children || <Outlet />}</div>
        {showFooter && (
          <footer className="border-t py-4">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} React Router v7 Demo. All rights reserved.
              </p>
            </div>
          </footer>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
