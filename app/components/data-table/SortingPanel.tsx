import React from "react";
import type { SortingState } from "../../lib/types/data-table";
import { Button } from "../ui/button";
import { X, ArrowUp, ArrowDown } from "lucide-react";

interface SortingPanelProps {
  sorting: SortingState[];
  onRemoveSort: (id: string) => void;
  onClearAllSorts: () => void;
  columns: any[];
}

const SortingPanel: React.FC<SortingPanelProps> = ({ sorting, onRemoveSort, onClearAllSorts, columns }) => {
  if (sorting.length === 0) return null;

  return (
    <div className="p-2 border-b bg-muted/30">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">Ordenação:</span>
        {sorting.map((sort, index) => {
          const column = columns.find((c) => c.accessor === sort.id);
          return (
            <div key={index} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
              <span className="font-medium">{column?.header}</span>
              {sort.desc ? (
                <span className="flex items-center gap-1 text-primary">
                  (Z→A <ArrowDown size={14} className="text-primary" />)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-primary">
                  (A→Z <ArrowUp size={14} className="text-primary" />)
                </span>
              )}
              <button
                className="ml-1 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20"
                onClick={() => onRemoveSort(sort.id)}
                title="Remover esta ordenação"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
        {sorting.length > 1 && (
          <div className="ml-auto flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllSorts}
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
            >
              Limpar ordenação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingPanel;
