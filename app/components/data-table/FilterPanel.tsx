import { X } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import type { Filter } from "~/lib/types/data-table";

interface FilterPanelProps {
  filters: Filter[];
  onRemoveFilter: (id: string, value: any) => void;
  onClearAllFilters: () => void;
  columns: any[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onRemoveFilter,
  onClearAllFilters,
  columns,
}) => {
  if (filters.length === 0) return null;

  // Formatar o valor do filtro para exibição
  const formatFilterValue = (value: any): string => {
    if (value === null) return "(vazio)";
    if (value === undefined) return "(indefinido)";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Formatar o operador do filtro para exibição
  const formatOperator = (operator: string): string => {
    switch (operator) {
      case "exact":
        return "=";
      case "contains":
        return "contém";
      case "startswith":
        return "começa com";
      case "endswith":
        return "termina com";
      case "gt":
        return ">";
      case "gte":
        return ">=";
      case "lt":
        return "<";
      case "lte":
        return "<=";
      case "date":
        return "na data";
      default:
        return operator;
    }
  };

  const handleRemoveFilter = (id: string, value: any) => {
    onRemoveFilter(id, value);
  };

  const handleClearAllFilters = () => {
    onClearAllFilters();
  };

  return (
    <div className="bg-muted/30 border-b p-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Filtros ativos:</span>
        {filters.map((filter, index) => {
          const column = columns.find((c) => c.accessor === filter.id);
          const columnName = column?.header || filter.id;

          return (
            <div
              key={index}
              className="bg-muted/70 flex items-center gap-1 rounded-md px-2 py-1 text-sm"
            >
              <span className="font-medium">{columnName}</span>
              <span className="text-muted-foreground">
                {formatOperator(filter.operator)}
              </span>
              <span>{formatFilterValue(filter.value)}</span>
              <button
                className="text-muted-foreground hover:text-foreground hover:bg-muted ml-1 rounded-full p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFilter(filter.id, filter.value);
                }}
                title="Remover este filtro"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllFilters}
            className="text-primary hover:text-primary/90"
          >
            Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
