import { Outlet } from "react-router";
import { DashboardLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Produtos - React Router v7 Demo" },
    { name: "description", content: "Produtos section with layout routes and dynamic segments" }
  ];
}

export default function ProdutosLayout() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-1">
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg shadow-sm p-6">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}
