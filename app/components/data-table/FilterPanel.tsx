import React from "react";
import type { Filter } from "../../lib/types/data-table";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface FilterPanelProps {
  filters: Filter[];
  onRemoveFilter: (id: string, value: any) => void;
  onClearAllFilters: () => void;
  columns: any[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onRemoveFilter, onClearAllFilters, columns }) => {
  if (filters.length === 0) return null;

  return (
    <div className="p-2 border-b bg-muted/30">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">Filtros ativos:</span>
        {filters.map((filter, index) => {
          const column = columns.find((c) => c.accessor === filter.id);
          return (
            <div key={index} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
              {column?.header}: {filter.operator} {String(filter.value)}
              <button
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => onRemoveFilter(filter.id, filter.value)}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" onClick={onClearAllFilters} className="text-primary hover:text-primary/90">
            Limpar filtros
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
