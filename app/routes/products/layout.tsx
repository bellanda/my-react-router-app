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
      <div className="p-0 w-full">
        <div className="bg-white dark:bg-(--background) p-0">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}
