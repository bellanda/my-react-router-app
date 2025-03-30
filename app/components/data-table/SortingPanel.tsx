import React, { useState, useEffect } from "react";
import type { SortingState } from "../../lib/types/data-table";
import { Button } from "../ui/button";
import { X, ArrowUp, ArrowDown, GripVertical } from "lucide-react";

interface SortingPanelProps {
  sorting: SortingState[];
  onRemoveSort: (id: string) => void;
  onClearAllSorts: () => void;
  onReorderSorts: (newOrder: SortingState[]) => void;
  columns: any[];
}

const SortingPanel: React.FC<SortingPanelProps> = ({ sorting, onRemoveSort, onClearAllSorts, onReorderSorts, columns }) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);
  const [items, setItems] = useState<SortingState[]>(sorting);

  // Sincronizar items com prop sorting
  useEffect(() => {
    setItems(sorting);
  }, [sorting]);

  if (sorting.length === 0) return null;

  const handleDragStart = (index: number, e: React.DragEvent) => {
    console.log(`[SortingPanel] Iniciando arrasto do item ${index}`);
    setDraggedItem(index);

    // Melhorar experiência em navegadores modernos
    if (e.dataTransfer.setDragImage) {
      try {
        e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
      } catch (err) {
        console.error("Erro ao definir imagem de arrasto:", err);
      }
    }

    e.dataTransfer.effectAllowed = "move";

    // Dados necessários para alguns navegadores
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem === null) return;
    if (draggedItem === index) return;

    e.dataTransfer.dropEffect = "move";
    setDraggedOver(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem === null) return;
    if (draggedItem === index) return;

    console.log(`[SortingPanel] Soltando item ${draggedItem} na posição ${index}`);

    // Executar reordenação localmente primeiro para feedback visual imediato
    const newItems = [...items];
    const draggedItemContent = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, draggedItemContent);

    // Atualizar estado local
    setItems(newItems);

    // Notificar o componente pai
    console.log("[SortingPanel] Notificando componente pai da reordenação:", newItems);
    onReorderSorts(newItems);

    // Limpar estados
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("[SortingPanel] Drag terminado");
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const handleRemoveSort = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Impedir propagação do evento
    console.log(`[SortingPanel] Removendo ordenação para ${id}`);

    // Limpar estados de drag para evitar conflitos
    setDraggedItem(null);
    setDraggedOver(null);

    // Remover a ordenação com pequeno delay para garantir que os estados foram limpos
    setTimeout(() => {
      onRemoveSort(id);
    }, 10);
  };

  const handleClearAll = () => {
    console.log("[SortingPanel] Limpando todas as ordenações");
    onClearAllSorts();
  };

  return (
    <div className="p-2 border-b bg-muted/30">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">Ordenação:</span>
        {items.map((sort, index) => {
          const column = columns.find((c) => c.accessor === sort.id);
          return (
            <div
              key={index}
              className={`bg-muted px-3 py-1 rounded-md text-sm flex items-center gap-2 cursor-move ${
                draggedItem === index ? "opacity-50 bg-primary/10" : ""
              } ${draggedOver === index ? "border-2 border-primary" : ""}`}
              draggable={true}
              onDragStart={(e) => handleDragStart(index, e)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              data-index={index}
            >
              <div className="cursor-grab" onMouseDown={(e) => e.stopPropagation()}>
                <GripVertical size={14} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{column?.header || sort.id}</span>
                {sort.desc ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
              </div>
              <button
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => handleRemoveSort(sort.id, e)}
                onMouseDown={(e) => e.stopPropagation()}
                title="Remover esta ordenação"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-primary hover:text-primary/90">
            Limpar ordenação
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SortingPanel;
