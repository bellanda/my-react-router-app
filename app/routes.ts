import { index, layout, prefix, route } from "@react-router/dev/routes";

import type { RouteConfig } from "@react-router/dev/routes";

export default [
  // Landing page usando LandingLayout
  index("routes/home.tsx"),
  route("features", "routes/landing/features.tsx"),
  route("pricing", "routes/landing/pricing.tsx"),
  route("about", "routes/landing/about.tsx"),
  route("contact", "routes/landing/contact.tsx"),
  route("faq", "routes/landing/faq.tsx"),
  route("blog", "routes/landing/blog.tsx"),

  // Documentation section
  route("docs", "routes/landing/docs.tsx"),

  // Dashboard section (MainLayout)
  route("dashboard", "routes/dashboard/index.tsx", [
    route("analytics", "routes/dashboard/analytics.tsx"),
    route("settings", "routes/dashboard/settings.tsx"),
  ]),

  // Products section (MainLayout)
  route("products", "routes/products/layout.tsx", [
    index("routes/products/index.tsx"),
    route(":produtoId", "routes/products/produto.tsx"),
  ]),

  // Sales section (MainLayout)
  route("sales", "routes/sales/layout.tsx", [index("routes/sales/index.tsx")]),

  // User section with prefixed routes (MainLayout)
  ...prefix("users", [
    index("routes/users/index.tsx"),
    route(":userId", "routes/users/profile.tsx"),
    route(":userId/edit", "routes/users/edit.tsx"),
  ]),

  ...prefix("auth", [
    layout("layouts/auth-layout.tsx", [
      route("login", "routes/auth/login.tsx"),
      route("register", "routes/auth/register.tsx"),
      route("forgot-password", "routes/auth/forgot-password.tsx"),
      route("reset-password/:token", "routes/auth/reset-password.tsx"),
    ]),
  ]),

  // 404 page for unmatched routes
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
