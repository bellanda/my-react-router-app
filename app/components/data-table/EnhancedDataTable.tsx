import React, { useCallback, useRef, useEffect } from "react";
import type { TableConfig } from "../../lib/types/data-table";
import { cn } from "../../lib/utils";
import { useDataTable } from "../../hooks/useDataTable";
import DataTableHeader from "./DataTableHeader";
import FilterPanel from "./FilterPanel";
import SortingPanel from "./SortingPanel";
import { Loader2 } from "lucide-react";

interface EnhancedDataTableProps {
  config: TableConfig;
  className?: string;
  onRowClick?: (row: any) => void;
}

const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({ config, className, onRowClick }) => {
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
    handleSort,
    handleFilter,
    handleResetFilters,
    setTableState
  } = useDataTable(config);

  // Referência para o container de scroll
  const containerRef = useRef<HTMLDivElement>(null);
  // Referência para rastrear se já estamos processando um scroll
  const isCheckingScrollRef = useRef(false);

  // Função que verifica o scroll e carrega mais dados quando necessário
  const checkScrollAndLoadMore = useCallback(() => {
    if (!containerRef.current || isLoading || isFetching || !hasNextPage) {
      console.log("Ignorando verificação de scroll: condições impedem carregamento", {
        isLoading,
        isFetching,
        hasNextPage
      });
      return;
    }

    // Evita múltiplas execuções durante um frame de animação
    if (isCheckingScrollRef.current) return;
    isCheckingScrollRef.current = true;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    // Depuração
    console.log("EnhancedDataTable: Informações de scroll", {
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceToBottom,
      hasNextPage
    });

    // Carregar mais quando estiver a 300px do fim (um valor maior para garantir carregamento antecipado)
    if (distanceToBottom < 300) {
      console.log("EnhancedDataTable: Carregando próxima página, distância do fim:", distanceToBottom);
      fetchNextPage();
    }

    // Liberar a flag após o processamento
    setTimeout(() => {
      isCheckingScrollRef.current = false;
    }, 100);
  }, [fetchNextPage, hasNextPage, isLoading, isFetching]);

  // Configurar o scroll infinito com otimização
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      // Função para manipular o evento de scroll
      const handleScroll = () => {
        // Usar requestAnimationFrame para limitar a frequência de chamadas
        requestAnimationFrame(() => {
          checkScrollAndLoadMore();
        });
      };

      // Adicionar listener de scroll
      scrollContainer.addEventListener("scroll", handleScroll);

      // Verificar se precisa carregar mais dados inicialmente
      const checkInitialLoad = () => {
        if (scrollContainer.scrollHeight <= scrollContainer.clientHeight + 300 && hasNextPage && !isLoading && !isFetching) {
          console.log("EnhancedDataTable: Carregando mais dados inicialmente porque há espaço");
          fetchNextPage();
        }
      };

      // Executar verificação inicial após um tempo para garantir que o DOM foi renderizado
      setTimeout(checkInitialLoad, 200);

      // Forçar uma verificação quando a janela é redimensionada
      const handleResize = () => {
        checkInitialLoad();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [checkScrollAndLoadMore, hasNextPage, isLoading, isFetching, fetchNextPage, data.length]);

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
    return data.map((row, rowIndex) => (
      <div
        key={`row-${rowIndex}`}
        className={cn("flex border-b", rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20", "cursor-pointer hover:bg-accent/10")}
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
              className="py-2 px-4 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ width: cellWidth }}
              title={String(displayValue)}
            >
              {displayValue}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className={cn("flex flex-col border rounded-md", className)}>
      {/* Barra de filtros */}
      {tableState.filters.length > 0 && (
        <FilterPanel
          filters={tableState.filters}
          onRemoveFilter={(id, value) => handleFilter([{ id, operator: "remove", value }])}
          onClearAllFilters={handleResetFilters}
          columns={columns}
        />
      )}

      {/* Barra de ordenação */}
      {tableState.sorting.length > 0 && (
        <SortingPanel
          sorting={tableState.sorting}
          onRemoveSort={(id) => handleSort(id + ":remove")}
          onClearAllSorts={() => {
            // Limpar todas as ordenações
            setTableState((prev: any) => ({
              ...prev,
              sorting: [],
              pagination: { ...prev.pagination, pageIndex: 0 }
            }));
          }}
          columns={columns}
        />
      )}

      {/* Cabeçalho da tabela */}
      <div className="flex border-b bg-muted/50">
        {visibleColumns.map((column) => (
          <DataTableHeader
            key={column.accessor}
            column={column}
            sorting={tableState.sorting}
            filters={tableState.filters}
            onSort={handleSort}
            onFilter={(filter) => handleFilter([filter])}
            onRemoveFilter={(id, value) => handleFilter([{ id, operator: "remove", value }])}
            endpoint={config.endpoint}
            style={{ width: cellWidth }}
          />
        ))}
      </div>

      {/* Corpo da tabela com scroll */}
      <div ref={containerRef} className="flex-1 overflow-auto" style={{ height: "600px" }}>
        {isLoading && data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
              <span className="text-muted-foreground">Carregando...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-destructive">Erro ao carregar dados: {(error as Error)?.message || "Erro desconhecido"}</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted">Nenhum dado encontrado</div>
          </div>
        ) : (
          <>
            {renderRows()}
            {isFetching && (
              <div className="py-4 text-center">
                <div className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Carregando mais...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Barra de status */}
      <div className="px-4 py-2 border-t bg-muted/20 text-sm flex justify-between">
        <div>
          {totalCount > 0
            ? `${Math.min(data.length, totalCount)} de ${totalCount} itens ${
                hasNextPage ? "(Mais disponíveis)" : "(Todos carregados)"
              }`
            : "0 itens"}
        </div>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span className="text-muted-foreground">Carregando mais...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDataTable;
