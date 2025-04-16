import DataTable from "~/components/data-table";
import { AuthStatus } from "~/layouts/AuthStatus";
import { salesTableConfig } from "./table-config";
export function meta() {
  return [
    { title: "Vendas - React Router v7 Demo" },
    {
      name: "description",
      content: "Listagem de vendas com React Router v7",
    },
  ];
}

export default function SalesPage() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Vendas</h1>
        </div>
        <div className="flex items-end gap-1">
          <AuthStatus />
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-2">
            Nova Venda
          </button>
        </div>
      </div>

      <div className="w-full py-2">
        <DataTable config={salesTableConfig} />
      </div>
    </div>
  );
}
