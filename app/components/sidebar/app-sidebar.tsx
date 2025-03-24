"use client";

import * as React from "react";
import { BarChart3, BookOpen, Home, LayoutDashboard, Package, Settings, ShoppingCart, User, FileText } from "lucide-react";

import { NavMain } from "~/components/sidebar/nav-main";
import { NavProjects } from "~/components/sidebar/nav-projects";
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
      isActive: true,
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
      items: [
        {
          title: "Todos os Produtos",
          url: "/products"
        },
        {
          title: "Detalhes do Produto",
          url: "/products/product"
        }
      ]
    },
    {
      title: "Usuários",
      url: "/users",
      icon: User,
      items: []
    },
    {
      title: "Blog",
      url: "/blog",
      icon: FileText,
      items: []
    },
    {
      title: "Documentação",
      url: "/docs",
      icon: BookOpen,
      items: []
    }
  ],
  projects: [
    {
      name: "E-commerce",
      url: "/produc",
      icon: ShoppingCart
    },
    {
      name: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3
    },
    {
      name: "Configurações",
      url: "/dashboard/settings",
      icon: Settings
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
