import { Outlet } from "react-router";
import { DashboardLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Vendas - React Router v7 Demo" },
    {
      name: "description",
      content: "Vendas section with layout routes and dynamic segments",
    },
  ];
}

export default function SalesLayout() {
  return (
    <DashboardLayout>
      <div className="w-full p-0">
        <div className="bg-white p-0 dark:bg-(--background)">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}
