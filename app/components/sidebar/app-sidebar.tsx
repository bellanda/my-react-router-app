"use client";

import { Home, LayoutDashboard, Package, User } from "lucide-react";
import * as React from "react";

import { NavMain } from "~/components/sidebar/nav-main";
import { NavUser } from "~/components/sidebar/nav-user";
import { TeamSwitcher } from "~/components/sidebar/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "~/components/ui/sidebar";

// Dados da aplicação adaptados para as rotas existentes
const data = {
  user: {
    name: "Usuário Demo",
    email: "usuario@exemplo.com",
    avatar: "/avatars/avatar.jpg"
  },
  teams: [
    {
      name: "Sua Empresa",
      logo: LayoutDashboard,
      plan: "Pro"
    }
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      items: []
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Visão Geral",
          url: "/dashboard"
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics"
        },
        {
          title: "Configurações",
          url: "/dashboard/settings"
        }
      ]
    },
    {
      title: "Produtos",
      url: "/products",
      icon: Package,
      items: []
    },
    {
      title: "Usuários",
      url: "/users",
      icon: User,
      items: []
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Usando uma abordagem que força a navegação completa para as páginas do dashboard
  const forceRefresh = (url: string) => `${url}${url.includes("?") ? "&" : "?"}forceRefresh=${Date.now()}`;

  // Modificar URLs dos itens do dashboard para forçar a navegação
  const navItemsWithForcedRefresh = data.navMain.map((item) => {
    if (item.title === "Dashboard" && item.items) {
      return {
        ...item,
        items: item.items.map((subItem) => ({
          ...subItem,
          url: forceRefresh(subItem.url)
        }))
      };
    }
    return item;
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItemsWithForcedRefresh} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
