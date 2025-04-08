import { Outlet } from "react-router";
import { DashboardLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Produtos - React Router v7 Demo" },
    {
      name: "description",
      content: "Produtos section with layout routes and dynamic segments",
    },
  ];
}

export default function ProdutosLayout() {
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
