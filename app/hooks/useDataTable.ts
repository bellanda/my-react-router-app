import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { TableConfig, TableState, Filter, SortingState } from "../lib/types/data-table";
import { fetchTableData } from "../lib/services/api";
import { inferColumnType } from "../lib/utils";

export function useDataTable(config: TableConfig) {
  // Estado local da tabela
  const [tableState, setTableState] = useState<TableState>({
    filters: [],
    sorting: config.initialSort ? [config.initialSort] : [],
    pagination: {
      pageIndex: 0,
      pageSize: config.defaultPageSize || 50
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

  // Referência para evitar requisições duplicadas
  const fetchingRef = useRef(false);
  // Referência para o último pageIndex solicitado
  const lastPageRequestedRef = useRef(0);

  // Função para inferir automaticamente os tipos de colunas
  const inferColumnTypes = useCallback(
    (data: any[]) => {
      if (!data || data.length === 0) return config.columns;

      const firstRow = data[0];

      return config.columns.map((column) => {
        if (column.type !== ("auto" as any)) return column;

        const sampleValue = firstRow[column.accessor];
        const inferredType = inferColumnType(column.accessor, sampleValue);

        return {
          ...column,
          type: inferredType as any
        };
      });
    },
    [config.columns]
  );

  // Função para buscar dados
  const fetchData = useCallback(
    async (page: number, append = false) => {
      // Evitar requisições duplicadas para a mesma página
      if (fetchingRef.current) {
        console.log(`[useDataTable] Ignorando fetchData para página ${page}, outra requisição em andamento`);
        return;
      }

      // Registrar essa requisição para evitar duplicatas
      fetchingRef.current = true;
      lastPageRequestedRef.current = page;

      if (append) {
        setIsFetchingMore(true);
      } else {
        setIsLoading(true);
      }

      console.log(`[useDataTable] Iniciando fetchData para página ${page}, append=${append}`);

      try {
        const response = await fetchTableData(
          config.endpoint,
          tableState.filters,
          tableState.sorting,
          page,
          tableState.pagination.pageSize
        );

        // Verificar se esta ainda é a requisição mais recente
        if (page !== lastPageRequestedRef.current) {
          console.log(`[useDataTable] Ignorando resultado para página ${page}, página atual é ${lastPageRequestedRef.current}`);
          return;
        }

        if (append) {
          setData((prev) => [...prev, ...response.data]);
        } else {
          setData(response.data);
        }

        setTotalPages(response.pageCount);
        setTotalItems(response.totalCount);

        // Verificar se há mais páginas disponíveis
        const nextPageAvailable = page < response.pageCount - 1;
        console.log(`[useDataTable] Página ${page} carregada, próxima página disponível: ${nextPageAvailable}`);
        setHasNextPage(nextPageAvailable);

        setIsError(false);
        setError(null);
      } catch (err) {
        console.error(`[useDataTable] Erro ao buscar dados para página ${page}:`, err);
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Erro ao buscar dados"));
        if (!append) {
          setData([]);
        }
      } finally {
        if (append) {
          setIsFetchingMore(false);
        } else {
          setIsLoading(false);
        }
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

    // Resetar flags
    fetchingRef.current = false;
    lastPageRequestedRef.current = 0;

    // Carregar primeira página
    fetchData(0, false);
  }, [fetchData, tableState.filters, tableState.sorting]);

  // Função para carregar a próxima página
  const fetchNextPage = useCallback(() => {
    // Verificar condições que impedem o carregamento
    if (isLoading || isFetchingMore || !hasNextPage || fetchingRef.current) {
      console.log("[useDataTable] fetchNextPage: Condições impedem carregamento", {
        isLoading,
        isFetchingMore,
        hasNextPage,
        fetchingRef: fetchingRef.current,
        currentPage: tableState.pagination.pageIndex
      });
      return;
    }

    const nextPage = tableState.pagination.pageIndex + 1;
    console.log(`[useDataTable] fetchNextPage executando para página ${nextPage}`);

    // Atualizar página atual imediatamente para evitar chamadas duplicadas
    setTableState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: nextPage
      }
    }));

    // Marcar o início do carregamento
    setIsFetchingMore(true);

    // Buscar próxima página
    fetchData(nextPage, true);
  }, [fetchData, hasNextPage, isLoading, isFetchingMore, tableState.pagination.pageIndex]);

  // Inferir tipos de colunas automaticamente
  const columns = useMemo(() => {
    if (data.length === 0) return config.columns;
    return inferColumnTypes(data);
  }, [data, config.columns, inferColumnTypes]);

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

    // Comportamento padrão para cliques no cabeçalho
    setTableState((prev) => {
      const existingSortIndex = prev.sorting.findIndex((s) => s.id === columnId);

      // Se já existe, alternar entre asc, desc e remover
      if (existingSortIndex > -1) {
        const existingSort = prev.sorting[existingSortIndex];
        if (existingSort.desc) {
          // Se já está em desc, remover esta ordenação
          return {
            ...prev,
            sorting: prev.sorting.filter((s) => s.id !== columnId),
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

  const handleFilter = useCallback((filters: Filter[]) => {
    setTableState((prev) => {
      // Process each filter command
      let updatedFilters = [...prev.filters];

      for (const filter of filters) {
        // Handle remove operation
        if (filter.operator === "remove") {
          updatedFilters = updatedFilters.filter((f) => !(f.id === filter.id && f.value === filter.value));
        } else {
          // Check if this filter already exists
          const existingFilterIndex = updatedFilters.findIndex((f) => f.id === filter.id && f.value === filter.value);

          // If filter exists, replace it (or remove for toggle behavior)
          if (existingFilterIndex > -1) {
            updatedFilters = updatedFilters.filter((_, idx) => idx !== existingFilterIndex);
          } else {
            // Add new filter
            updatedFilters.push(filter);
          }
        }
      }

      return {
        ...prev,
        filters: updatedFilters,
        pagination: { ...prev.pagination, pageIndex: 0 } // Reset to first page
      };
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setTableState((prev) => ({
      ...prev,
      filters: [],
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Reload data function for manual refresh
  const refetch = useCallback(() => {
    // Resetar flags
    fetchingRef.current = false;

    // Recarregar página atual
    fetchData(tableState.pagination.pageIndex, false);
  }, [fetchData, tableState.pagination.pageIndex]);

  return {
    columns,
    data,
    totalCount: totalItems,
    tableState,
    isLoading,
    isFetching: isLoading || isFetchingMore,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    handleSort,
    handleFilter,
    handleResetFilters,
    setTableState
  };
}
