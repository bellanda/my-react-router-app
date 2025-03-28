import React, { useEffect, useState, useCallback, useRef } from "react";
import type { TableConfig, TableState, Filter, SortingState } from "../../lib/types/data-table";
import { fetchTableData } from "../../lib/services/api";
import FilterPanel from "./FilterPanel";
import SortingPanel from "./SortingPanel";
import DataTableHeader from "./DataTableHeader";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface DataTableProps {
  config: TableConfig;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({ config, className }) => {
  // Estado local da tabela
  const [tableState, setTableState] = useState<TableState>({
    filters: [],
    sorting: config.initialSort ? [config.initialSort] : [],
    pagination: {
      pageIndex: 0,
      pageSize: config.defaultPageSize || 20
    }
  });

  // Estados para os dados e carregamento
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Referência para o container de scroll
  const containerRef = useRef<HTMLDivElement>(null);

  // Referência para evitar requisições duplicadas
  const fetchingRef = useRef(false);

  // Função para buscar dados
  const fetchData = useCallback(
    async (page: number, append = false) => {
      // Evitar requisições duplicadas
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (append) {
        setIsFetchingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await fetchTableData(
          config.endpoint,
          tableState.filters,
          tableState.sorting,
          page,
          tableState.pagination.pageSize
        );

        if (append) {
          setData((prev) => [...prev, ...response.data]);
        } else {
          setData(response.data);
        }

        setTotalPages(response.pageCount);
        setTotalItems(response.totalCount);
        setHasNextPage(page < response.pageCount - 1);
        setIsError(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Erro ao buscar dados"));
        if (!append) {
          setData([]);
        }
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
        fetchingRef.current = false;
      }
    },
    [config.endpoint, tableState.filters, tableState.sorting, tableState.pagination.pageSize]
  );

  // Carregar dados iniciais ou quando mudam os filtros/ordenação
  useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: 0
      }
    }));
    setData([]); // Limpar dados existentes ao mudar filtros/ordenação
    fetchData(0, false);
  }, [fetchData, tableState.filters, tableState.sorting]);

  // Função que verifica o scroll e carrega mais dados quando necessário
  const checkScrollAndLoadMore = useCallback(() => {
    if (!containerRef.current || isLoading || isFetchingMore || !hasNextPage || fetchingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Distância do final da página
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Depuração para entender o comportamento do scroll
    console.log("Scroll info:", {
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceToBottom,
      scrollPercentage,
      hasNextPage,
      current: tableState.pagination.pageIndex
    });

    // Carregar mais quando estiver próximo do final da página
    // Usar distância absoluta em pixels para maior confiabilidade
    if (distanceToBottom < 200) {
      console.log("Carregando página", tableState.pagination.pageIndex + 1);
      const nextPage = tableState.pagination.pageIndex + 1;

      // Atualizar o estado imediatamente para evitar múltiplas chamadas
      fetchingRef.current = true;
      setIsFetchingMore(true);

      // Atualizar página atual
      setTableState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageIndex: nextPage
        }
      }));

      // Buscar próxima página
      fetchData(nextPage, true);
    }
  }, [fetchData, hasNextPage, isLoading, isFetchingMore, tableState.pagination.pageIndex]);

  // Configurar o scroll infinito com otimização para evitar chamadas frequentes
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          // Usar requestAnimationFrame para limitar as chamadas de scroll
          window.requestAnimationFrame(() => {
            checkScrollAndLoadMore();
            ticking = false;
          });
          ticking = true;
        }
      };

      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [checkScrollAndLoadMore]);

  // Manipuladores para ordenação e filtros
  const handleSort = useCallback((columnId: string) => {
    // Verificar se temos um comando especial de ordenação
    if (columnId.includes(":")) {
      const [realColumnId, command] = columnId.split(":");
      console.log("Comando especial de ordenação:", { realColumnId, command });

      setTableState((prev) => {
        // Comando para remover ordenação
        if (command === "remove") {
          return {
            ...prev,
            sorting: prev.sorting.filter((s) => s.id !== realColumnId),
            pagination: { ...prev.pagination, pageIndex: 0 }
          };
        }

        // Comando para ordenação ascendente (A a Z)
        if (command === "asc") {
          // Encontrar se já existe ordenação para esta coluna
          const existingSortIndex = prev.sorting.findIndex((s) => s.id === realColumnId);

          if (existingSortIndex !== -1) {
            // Atualizar ordenação existente
            const newSorting = [...prev.sorting];
            newSorting[existingSortIndex] = { id: realColumnId, desc: false };
            return {
              ...prev,
              sorting: newSorting,
              pagination: { ...prev.pagination, pageIndex: 0 }
            };
          } else {
            // Adicionar nova ordenação mantendo as existentes
            return {
              ...prev,
              sorting: [...prev.sorting, { id: realColumnId, desc: false }],
              pagination: { ...prev.pagination, pageIndex: 0 }
            };
          }
        }

        // Comando para ordenação descendente (Z a A)
        if (command === "desc") {
          // Encontrar se já existe ordenação para esta coluna
          const existingSortIndex = prev.sorting.findIndex((s) => s.id === realColumnId);

          if (existingSortIndex !== -1) {
            // Atualizar ordenação existente
            const newSorting = [...prev.sorting];
            newSorting[existingSortIndex] = { id: realColumnId, desc: true };
            return {
              ...prev,
              sorting: newSorting,
              pagination: { ...prev.pagination, pageIndex: 0 }
            };
          } else {
            // Adicionar nova ordenação mantendo as existentes
            return {
              ...prev,
              sorting: [...prev.sorting, { id: realColumnId, desc: true }],
              pagination: { ...prev.pagination, pageIndex: 0 }
            };
          }
        }

        return prev; // Sem alteração para comandos desconhecidos
      });

      return;
    }

    // Comportamento padrão para cliques no cabeçalho (sem comando especial)
    setTableState((prev) => {
      const existingSortIndex = prev.sorting.findIndex((sort) => sort.id === columnId);

      // Se já existe, alternar entre asc, desc e remover
      if (existingSortIndex > -1) {
        const existingSort = prev.sorting[existingSortIndex];

        if (existingSort.desc) {
          // Se já está em desc, remover esta ordenação
          return {
            ...prev,
            sorting: prev.sorting.filter((sort) => sort.id !== columnId),
            pagination: { ...prev.pagination, pageIndex: 0 }
          };
        } else {
          // Se está em asc, mudar para desc
          const newSorting = [...prev.sorting];
          newSorting[existingSortIndex] = { ...existingSort, desc: true };
          return {
            ...prev,
            sorting: newSorting,
            pagination: { ...prev.pagination, pageIndex: 0 }
          };
        }
      }

      // Adicionar nova ordenação mantendo as existentes
      return {
        ...prev,
        sorting: [...prev.sorting, { id: columnId, desc: false }],
        pagination: { ...prev.pagination, pageIndex: 0 }
      };
    });
  }, []);

  // Adicionar/atualizar filtro
  const handleFilter = useCallback((filter: Filter & { _updatedFilters?: Filter[] }) => {
    setTableState((prev) => {
      // Caso especial para atualização de múltiplos filtros
      if (filter.value === "__UPDATE_FILTERS__" && filter._updatedFilters) {
        return {
          ...prev,
          filters: filter._updatedFilters,
          pagination: { ...prev.pagination, pageIndex: 0 }
        };
      }

      // Verificar se já existe filtro para esta coluna
      const existingFilterIndex = prev.filters.findIndex((f) => f.id === filter.id && f.value === filter.value);

      // Se o filtro já existe e tem o mesmo valor, remover (toggle)
      if (existingFilterIndex > -1) {
        return {
          ...prev,
          filters: prev.filters.filter((_, idx) => idx !== existingFilterIndex),
          pagination: { ...prev.pagination, pageIndex: 0 }
        };
      }

      // Adicionar novo filtro
      return {
        ...prev,
        filters: [...prev.filters, filter],
        pagination: { ...prev.pagination, pageIndex: 0 }
      };
    });
  }, []);

  // Remover filtro
  const handleRemoveFilter = useCallback((columnId: string, value: any) => {
    setTableState((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => !(f.id === columnId && f.value === value)),
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Limpar todos os filtros
  const handleClearAllFilters = useCallback(() => {
    setTableState((prev) => ({
      ...prev,
      filters: [],
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Limpar todas as ordenações
  const handleClearAllSorts = useCallback(() => {
    setTableState((prev) => ({
      ...prev,
      sorting: [],
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Remover uma ordenação específica
  const handleRemoveSort = useCallback((columnId: string) => {
    setTableState((prev) => ({
      ...prev,
      sorting: prev.sorting.filter((s) => s.id !== columnId),
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Calcular largura da célula (distribuição uniforme por padrão)
  const visibleColumns = config.columns.filter((col) => !col.hidden);
  const columnCount = visibleColumns.length;
  const cellWidth = `${100 / columnCount}%`;

  // Renderizar cabeçalho
  const renderHeader = () => {
    return (
      <div className="flex border-b bg-muted/50">
        {visibleColumns.map((column) => (
          <DataTableHeader
            key={column.accessor}
            column={column}
            sorting={tableState.sorting}
            filters={tableState.filters}
            onSort={handleSort}
            onFilter={handleFilter}
            onRemoveFilter={handleRemoveFilter}
            endpoint={config.endpoint}
            style={{ width: cellWidth }}
          />
        ))}
      </div>
    );
  };

  // Renderizar linhas
  const renderRows = () => {
    return data.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className={cn("flex border-b", rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20")}>
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

  // Renderizar corpo da tabela
  return (
    <div className={cn("flex flex-col border rounded-md", className)}>
      {/* Barra de filtros */}
      {tableState.filters.length > 0 && (
        <FilterPanel
          filters={tableState.filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
          columns={config.columns}
        />
      )}

      {/* Barra de ordenação */}
      {tableState.sorting.length > 0 && (
        <SortingPanel
          sorting={tableState.sorting}
          onRemoveSort={handleRemoveSort}
          onClearAllSorts={handleClearAllSorts}
          columns={config.columns}
        />
      )}

      {/* Cabeçalho da tabela */}
      {renderHeader()}

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
            <div className="text-destructive">Erro ao carregar dados: {error?.message}</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted">Nenhum dado encontrado</div>
          </div>
        ) : (
          <>
            {renderRows()}
            {isFetchingMore && (
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
          {totalItems > 0
            ? `${Math.min(data.length, totalItems)} de ${totalItems} itens ${
                hasNextPage ? "(Mais disponíveis)" : "(Todos carregados)"
              }`
            : "0 itens"}
        </div>
        <div className="flex items-center gap-2">
          {isFetchingMore && (
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

export default DataTable;
