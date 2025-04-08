import { ChevronDown, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DataTableHeader from "~/components/data-table/DataTableHeader";
import FilterPanel from "~/components/data-table/FilterPanel";
import SortingPanel from "~/components/data-table/SortingPanel";
import { useDataTable } from "~/hooks/use-data-table";
import type { TableConfig } from "~/lib/types/data-table";
import { cn } from "~/lib/utils";

interface EnhancedDataTableProps {
  config: TableConfig;
  className?: string;
  onRowClick?: (row: any) => void;
}

const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({
  config,
  className,
  onRowClick,
}) => {
  // Estados locais de UI
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Usar o hook personalizado
  const {
    columns,
    data,
    totalCount,
    tableState,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    loadChunk,
    goToPage,
    handleSort,
    handleFilter,
    handleResetFilters,
    reorderSorting,
    setTableState,
    isManualFilterSortChange,
  } = useDataTable(config);

  // Referência para o container de scroll
  const containerRef = useRef<HTMLDivElement>(null);

  // Referência para evitar carregamentos duplicados
  const isLoadingMoreRef = useRef(false);

  // Verificar scroll e carregar mais dados
  const checkScrollAndLoadMore = useCallback(() => {
    if (!containerRef.current || isFetching || !hasNextPage || !autoLoadEnabled)
      return;
    if (isLoadingMoreRef.current) return; // Prevenir múltiplas chamadas durante o scroll

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    // Carregar quando estiver a 150px do fim e verificar se já não carregamos todos os dados
    if (distanceToBottom < 150 && data.length < totalCount) {
      isLoadingMoreRef.current = true; // Sinalizar que estamos carregando
      fetchNextPage();

      // Resetar flag após carregamento, usando um timeout para dar tempo ao carregamento
      setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 100); // Tempo suficiente para completar a requisição e evitar múltiplos carregamentos
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetching,
    data.length,
    totalCount,
    autoLoadEnabled,
    showDebugInfo,
  ]);

  // Função para carregar todos os dados de uma vez
  const loadAllPages = useCallback(() => {
    if (!hasNextPage || isFetching) return;

    // Calcular tamanho do chunk baseado no total restante
    const remainingItems = totalCount - data.length;

    loadChunk(remainingItems);
  }, [hasNextPage, isFetching, totalCount, data.length, loadChunk]);

  // Carregar 100 itens de uma vez
  const handleLoadLargeChunk = useCallback(() => {
    if (!hasNextPage || isFetching) return;

    const chunkSize = 100;
    loadChunk(chunkSize);
  }, [hasNextPage, isFetching, loadChunk]);

  // Função para forçar scroll para o fim
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // EventListener para o scroll
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Só chamar checkScrollAndLoadMore quando o evento for disparado pelo usuário fazendo scroll
      if (autoLoadEnabled) {
        checkScrollAndLoadMore();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [checkScrollAndLoadMore, autoLoadEnabled]);

  // Verificação inicial para preenchimento da tabela - executada apenas uma vez quando os dados são carregados inicialmente
  useEffect(() => {
    // Referência para controlar se já fizemos o preenchimento inicial
    const initialFillCheck = useRef(false);

    // Se a tabela acabou de ser carregada e tem espaço para mais itens
    if (
      !initialFillCheck.current &&
      data.length > 0 &&
      hasNextPage &&
      !isFetching &&
      containerRef.current &&
      data.length < totalCount
    ) {
      initialFillCheck.current = true;
      const { scrollHeight, clientHeight } = containerRef.current;

      // Se o conteúdo não preenche o container
      if (scrollHeight <= clientHeight) {
        fetchNextPage();
      }
    }

    // Resetar a verificação inicial quando os dados são zerados (por exemplo, após mudar filtros)
    if (data.length === 0) {
      initialFillCheck.current = false;
    }
  }, [data.length, hasNextPage, isFetching, fetchNextPage, totalCount]);

  // Manipulador de clique de linha
  const handleRowClick = useCallback(
    (row: any) => {
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  // Calcular largura da célula (distribuição uniforme por padrão)
  const visibleColumns = columns.filter((col) => !col.hidden);
  const columnCount = visibleColumns.length;
  const cellWidth = `${100 / columnCount}%`;

  // Renderizar linhas
  const renderRows = () => {
    if (data.length === 0) {
      return (
        <div className="text-muted-foreground flex items-center justify-center py-10">
          {isLoading ? "Carregando dados..." : "Nenhum dado encontrado"}
        </div>
      );
    }

    return data.map((row, rowIndex) => (
      <div
        key={`row-${rowIndex}-${row.id || rowIndex}`}
        className={cn(
          "flex border-b",
          rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20",
          "hover:bg-accent/10 cursor-pointer"
        )}
        onClick={() => handleRowClick(row)}
      >
        {visibleColumns.map((column) => {
          // Suporte a accessors aninhados (como 'additional_info.total_stock_quantity')
          const keys = column.accessor.split(".");
          let value = row;
          for (const key of keys) {
            value = value?.[key];
          }

          const displayValue = column.formatFn ? column.formatFn(value) : value;

          return (
            <div
              key={`${rowIndex}-${column.accessor}`}
              className="overflow-hidden px-4 py-2 text-ellipsis whitespace-nowrap"
              style={{ width: column.width || cellWidth }}
              title={String(displayValue ?? "")}
            >
              {displayValue ?? ""}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className={cn("flex flex-col rounded-md border", className)}>
      {/* Barra de filtros */}
      {tableState.filters.length > 0 && (
        <FilterPanel
          filters={tableState.filters}
          onRemoveFilter={(id, value) => {
            // Garantir que a flag de alteração manual seja definida
            isManualFilterSortChange.current = true;
            handleFilter([{ id, operator: "remove", value }]);
          }}
          onClearAllFilters={() => {
            // Garantir que a flag de alteração manual seja definida
            isManualFilterSortChange.current = true;
            handleResetFilters();
          }}
          columns={columns}
        />
      )}

      {/* Barra de ordenação */}
      {tableState.sorting.length > 0 && (
        <SortingPanel
          sorting={tableState.sorting}
          onRemoveSort={(id) => {
            // Garantir que a flag de alteração manual seja definida
            isManualFilterSortChange.current = true;
            handleSort(id + ":remove");
          }}
          onReorderSorts={(newOrder) => {
            // Usar a função especializada do hook para reordenar
            reorderSorting(newOrder);
          }}
          onClearAllSorts={() => {
            // Garantir que a flag de alteração manual seja definida
            isManualFilterSortChange.current = true;

            // Remover todas as ordenações
            setTableState((prev) => ({
              ...prev,
              sorting: [],
              pagination: { ...prev.pagination, pageIndex: 0 },
            }));
          }}
          columns={columns}
        />
      )}

      {/* Container principal da tabela (com scroll) */}
      <div
        ref={containerRef}
        className="relative max-h-[calc(100vh-200px)] min-h-[300px] flex-1 overflow-auto"
      >
        {/* Cabeçalhos */}
        <div className="bg-muted sticky top-0 z-10 flex border-b">
          {visibleColumns.map((column) => (
            <DataTableHeader
              key={column.accessor}
              column={column}
              sorting={tableState.sorting}
              filters={tableState.filters}
              onSort={(column) => {
                // Garantir que a flag de alteração manual seja definida
                isManualFilterSortChange.current = true;
                handleSort(column);
              }}
              onFilter={(filter) => {
                // Garantir que a flag de alteração manual seja definida
                isManualFilterSortChange.current = true;
                handleFilter([filter]);
              }}
              onRemoveFilter={(id, value) => {
                // Garantir que a flag de alteração manual seja definida
                isManualFilterSortChange.current = true;
                handleFilter([{ id, operator: "remove", value }]);
              }}
              endpoint={config.endpoint}
              style={{ width: column.width || cellWidth }}
            />
          ))}
        </div>

        {/* Linhas */}
        <div className="relative">
          {isLoading && data.length === 0 ? (
            <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          ) : null}

          {renderRows()}

          {/* Indicador de carregamento de mais dados */}
          {isFetching && data.length > 0 && (
            <div className="flex justify-center border-t p-4">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Barra de controles avançados */}
      <div className="bg-muted/20 flex flex-col gap-3 border-t px-4 py-3 text-sm">
        {/* Status e controles principais */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {data.length} de {totalCount} itens{" "}
              {hasNextPage ? "(Mais disponíveis)" : "(Todos carregados)"}
            </span>

            {/* Botão para alternar debug */}
            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-muted-foreground rounded border px-2 py-1 text-xs"
            >
              {showDebugInfo ? "Ocultar Debug" : "Debug"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Carregamento automático toggle */}
            <button
              onClick={() => setAutoLoadEnabled(!autoLoadEnabled)}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${
                autoLoadEnabled
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground border"
              }`}
              title="Ativar/desativar carregamento automático ao rolar"
            >
              <input
                type="checkbox"
                checked={autoLoadEnabled}
                readOnly
                className="h-3 w-3"
              />
              <span>Auto-carregar</span>
            </button>

            {/* Botão de reload */}
            <button
              className="hover:bg-accent flex items-center gap-1 rounded border px-2 py-1 text-xs"
              onClick={scrollToBottom}
            >
              <ChevronDown className="h-3 w-3" />
              <span>Ir para fim</span>
            </button>
          </div>
        </div>

        {/* Debug info */}
        {showDebugInfo && (
          <div className="text-muted-foreground bg-muted/30 rounded p-2 text-xs">
            <div>
              Dados carregados: {data.length} | Total: {totalCount} |
              HasNextPage: {hasNextPage ? "Sim" : "Não"}
            </div>
            <div>
              Página atual:{" "}
              {Math.floor(data.length / tableState.pagination.pageSize) + 1} |
              Tamanho da página: {tableState.pagination.pageSize}
            </div>
            {containerRef.current && (
              <div>
                Container: {containerRef.current.scrollHeight}px altura |{" "}
                {containerRef.current.clientHeight}px visível | Scroll:{" "}
                {containerRef.current.scrollTop}px do topo
              </div>
            )}
          </div>
        )}

        {/* Barra de botões de carregamento */}
        {hasNextPage && !isFetching && (
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex-grow rounded-md px-3 py-1.5 text-xs"
              onClick={() => fetchNextPage()}
            >
              Carregar próximos {tableState.pagination.pageSize} itens
            </button>

            <button
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-3 py-1.5 text-xs"
              onClick={handleLoadLargeChunk}
            >
              Carregar +100
            </button>

            <button
              className="bg-accent text-accent-foreground hover:bg-accent/90 flex-grow rounded-md px-3 py-1.5 text-xs"
              onClick={loadAllPages}
            >
              Carregar tudo ({totalCount - data.length} restantes)
            </button>
          </div>
        )}

        {/* Indicador de carregamento na barra de status */}
        {isFetching && (
          <div className="text-primary flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando mais dados...</span>
          </div>
        )}

        {/* Paginação visual */}
        {totalCount > tableState.pagination.pageSize && (
          <div className="flex justify-center">
            <div className="flex items-center gap-1 overflow-x-auto p-1 text-xs">
              <span className="text-muted-foreground mr-1">
                Ir para página:
              </span>
              {Array.from({
                length: Math.min(
                  10,
                  Math.ceil(totalCount / tableState.pagination.pageSize)
                ),
              }).map((_, i) => {
                const isCurrentPage =
                  Math.floor(data.length / tableState.pagination.pageSize) >= i;
                return (
                  <button
                    key={i}
                    className={`flex h-6 min-w-6 items-center justify-center rounded-md px-2 ${
                      isCurrentPage
                        ? "bg-primary text-primary-foreground"
                        : "border-input hover:bg-accent border"
                    }`}
                    onClick={() => goToPage(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
              {Math.ceil(totalCount / tableState.pagination.pageSize) > 10 && (
                <span className="mx-1">...</span>
              )}
              <span className="text-muted-foreground ml-2">
                {Math.floor(data.length / tableState.pagination.pageSize) + 1}{" "}
                de {Math.ceil(totalCount / tableState.pagination.pageSize)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDataTable;
