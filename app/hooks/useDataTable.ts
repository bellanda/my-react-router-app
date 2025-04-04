import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchTableData } from "~/lib/services/api";
import type { Filter, SortingState, TableConfig, TableState } from "~/lib/types/data-table";
import { inferColumnType } from "~/lib/utils";

export function useDataTable(config: TableConfig) {
  // Load previous state from sessionStorage if exists
  const loadSavedState = (): TableState | null => {
    try {
      const storageKey = `data-table-state-${config.endpoint}`;
      const savedState = sessionStorage.getItem(storageKey);

      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed;
      }
    } catch (e) {
      console.error("Error loading saved table state:", e);
    }
    return null;
  };

  // Get initial state from sessionStorage or use default
  const getInitialState = (): TableState => {
    const savedState = loadSavedState();
    if (savedState) {
      return savedState;
    }

    // Estado padrão
    const defaultState = {
      filters: [],
      sorting: config.initialSort ? [config.initialSort] : [],
      pagination: {
        pageIndex: 0,
        pageSize: config.defaultPageSize || 50
      }
    };

    return defaultState;
  };

  // Estado local da tabela
  const [tableState, setTableState] = useState<TableState>(getInitialState());

  // Estados para os dados e carregamento
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    try {
      const storageKey = `data-table-state-${config.endpoint}`;
      // Não salvar o estado durante o carregamento inicial
      if (isLoading && data.length === 0) {
        return;
      }

      // Clone para garantir que não há referências circulares
      const stateToSave = JSON.stringify({
        filters: tableState.filters,
        sorting: tableState.sorting,
        pagination: {
          pageIndex: 0, // Sempre restaurar na primeira página
          pageSize: tableState.pagination.pageSize
        }
      });

      sessionStorage.setItem(storageKey, stateToSave);
      console.log(`Estado da tabela salvo em ${storageKey}:`, JSON.parse(stateToSave));
    } catch (e) {
      console.error("Error saving table state:", e);
    }
  }, [tableState.filters, tableState.sorting, config.endpoint, isLoading, data.length]);

  // Referência para evitar requisições duplicadas
  const fetchingRef = useRef(false);
  // Referência para o último pageIndex solicitado
  const lastPageRequestedRef = useRef(0);
  // Referência para controlar se uma alteração de filtro/ordenação foi iniciada manualmente
  const isManualFilterSortChangeRef = useRef(false);
  // Referência para indicar se já tivemos o carregamento inicial
  const initialLoadCompleteRef = useRef(false);

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
    async (page: number, append = false, itemLimit?: number, finalPage = false) => {
      // Evitar requisições duplicadas
      if (fetchingRef.current) {
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
          return;
        }

        // Determinar o número total de itens carregados após este carregamento
        const totalLoadedItems = append ? data.length + response.data.length : response.data.length;

        if (append) {
          // Garantir que não duplicamos dados
          if (data.length > 0 && response.data.length > 0) {
            setData((prev) => [...prev, ...response.data]);
          } else {
            setData((prev) => [...prev, ...response.data]);
          }
        } else {
          setData(response.data);
        }

        setTotalPages(response.pageCount);
        setTotalItems(response.totalCount);

        // Usar a informação de hasNextPage da própria API se disponível
        let nextPageAvailable = response.meta?.hasNextPage ?? false;

        if (nextPageAvailable === undefined) {
          // Verificar se há mais páginas disponíveis baseado no total de itens carregados
          nextPageAvailable = totalLoadedItems < response.totalCount;
        }

        // Verificação adicional para garantir que não continuamos carregando se já temos todos os dados
        if (totalLoadedItems >= response.totalCount) {
          nextPageAvailable = false;
        }

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
    [config.endpoint, tableState.filters, tableState.sorting, tableState.pagination.pageSize, data.length]
  );

  // Recarregar dados quando filtros ou ordenação mudam
  useEffect(() => {
    if (!initialLoadCompleteRef.current) {
      // Primeira carga - não depende de alterações de filtro/ordenação
      initialLoadCompleteRef.current = true;

      // Resetar para a primeira página
      setTableState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageIndex: 0
        }
      }));

      setData([]); // Limpar dados existentes

      // Resetar flags
      fetchingRef.current = false;
      lastPageRequestedRef.current = 0;

      // Carregar primeira página
      fetchData(0, false);
      return;
    }

    // Para cargas subsequentes, já estamos recarregando diretamente nas funções de
    // handleSort, handleFilter e handleResetFilters, portanto esse useEffect
    // não precisa mais reagir às alterações de filtro/ordenação
  }, [fetchData, config.endpoint]);

  // Carregar mais dados (paginação infinita)
  const fetchNextPage = useCallback(() => {
    if (fetchingRef.current || !hasNextPage) return;

    // Incrementar o pageIndex antes de carregar
    setTableState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: prev.pagination.pageIndex + 1
      }
    }));

    fetchData(tableState.pagination.pageIndex + 1, true);
  }, [fetchData, tableState.pagination.pageIndex, hasNextPage]);

  // Carregar um chunk específico de dados (quantidade específica)
  const loadChunk = useCallback(
    (itemCount: number) => {
      if (fetchingRef.current || !hasNextPage) return;

      const nextPage = tableState.pagination.pageIndex + 1;

      // Incrementar o pageIndex antes de carregar
      setTableState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageIndex: prev.pagination.pageIndex + 1
        }
      }));

      fetchData(nextPage, true, itemCount);
    },
    [fetchData, tableState.pagination.pageIndex, hasNextPage]
  );

  // Função para pular para uma página específica
  const goToPage = useCallback(
    (pageIndex: number) => {
      if (fetchingRef.current) {
        return;
      }

      if (pageIndex < 0 || pageIndex >= totalPages) {
        return;
      }

      // Atualizar estado da página
      setTableState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageIndex
        }
      }));

      // Limpar dados existentes para exibir apenas a página solicitada
      setData([]);

      // Carregar a página solicitada
      fetchData(pageIndex, false);
    },
    [fetchData, totalPages]
  );

  // Inferir tipos de colunas automaticamente
  const columns = useMemo(() => {
    if (data.length === 0) return config.columns;
    return inferColumnTypes(data);
  }, [data, config.columns, inferColumnTypes]);

  // Função para atualizar a ordenação
  const handleSort = useCallback(
    (column: string) => {
      // Definir que esta é uma alteração manual de filtro/ordenação
      isManualFilterSortChangeRef.current = true;

      // Processar comando especial de remoção
      if (column.endsWith(":remove")) {
        const id = column.replace(":remove", "");

        // Primeiro limpar dados existentes para dar feedback visual
        setData([]);

        // Atualizar o estado de ordenação
        setTableState((prev) => ({
          ...prev,
          sorting: prev.sorting.filter((sort) => sort.id !== id),
          pagination: { ...prev.pagination, pageIndex: 0 }
        }));

        // Resetar flags para garantir uma carga limpa
        fetchingRef.current = false;
        lastPageRequestedRef.current = 0;

        // Forçar reload após pequeno delay para permitir que a UI se atualize
        setTimeout(() => {
          fetchData(0, false);
        }, 10);

        return;
      }

      // Primeiro limpar dados existentes para dar feedback visual
      setData([]);

      // Atualizar o estado com a nova ordenação
      setTableState((prev) => {
        // Encontrar se a coluna já tem ordenação
        const existingSort = prev.sorting.find((sort) => sort.id === column);

        let newSorting;

        if (!existingSort) {
          // Adicionar nova ordenação
          newSorting = [...prev.sorting, { id: column, desc: false }];
        } else {
          // Alternar entre asc -> desc -> remover
          if (!existingSort.desc) {
            // Alterar de asc para desc
            newSorting = prev.sorting.map((sort) => (sort.id === column ? { ...sort, desc: true } : sort));
          } else {
            // Remover ordenação
            newSorting = prev.sorting.filter((sort) => sort.id !== column);
          }
        }

        return {
          ...prev,
          sorting: newSorting,
          pagination: { ...prev.pagination, pageIndex: 0 }
        };
      });

      // Resetar flags para garantir uma carga limpa
      fetchingRef.current = false;
      lastPageRequestedRef.current = 0;

      // Forçar reload após pequeno delay para permitir que a UI se atualize
      setTimeout(() => {
        fetchData(0, false);
      }, 10);
    },
    [fetchData]
  );

  const handleFilter = useCallback(
    (filters: Filter[]) => {
      // Marcar que esta é uma alteração manual
      isManualFilterSortChangeRef.current = true;

      // Primeiro limpar dados existentes para dar feedback visual
      setData([]);

      // Atualizar o estado com os novos filtros
      setTableState((prev) => {
        // Process each filter command
        let updatedFilters = [...prev.filters];

        for (const filter of filters) {
          // Caso especial para atualização em massa de filtros
          if (filter.value === "__UPDATE_FILTERS__" && (filter as any)._updatedFilters) {
            // Substituir completamente os filtros pelo conjunto fornecido
            updatedFilters = (filter as any)._updatedFilters;
            continue;
          }

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

      // Resetar flags para garantir uma carga limpa
      fetchingRef.current = false;
      lastPageRequestedRef.current = 0;

      // Forçar recarregamento após pequeno delay para permitir que a UI se atualize
      setTimeout(() => {
        fetchData(0, false);
      }, 10);
    },
    [fetchData]
  );

  const handleResetFilters = useCallback(() => {
    // Marcar que esta é uma alteração manual
    isManualFilterSortChangeRef.current = true;

    // Primeiro limpar dados existentes para dar feedback visual
    setData([]);

    // Reset filters and force a refresh of the data
    setTableState((prev) => ({
      ...prev,
      filters: [],
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));

    // Resetar flags para garantir uma carga limpa
    fetchingRef.current = false;
    lastPageRequestedRef.current = 0;

    // Refresh data with empty filters
    setTimeout(() => {
      fetchData(0, false);
    }, 10);
  }, [fetchData]);

  // Reload data function for manual refresh
  const refetch = useCallback(() => {
    // Resetar flags
    fetchingRef.current = false;

    // Recarregar página atual
    fetchData(tableState.pagination.pageIndex, false);
  }, [fetchData, tableState.pagination.pageIndex]);

  // Função especializada para reordenar as ordenações existentes
  const reorderSorting = useCallback(
    (newOrder: SortingState[]) => {
      // Definir que esta é uma alteração manual de filtro/ordenação
      isManualFilterSortChangeRef.current = true;

      // Primeiro limpar dados existentes para dar feedback visual
      setData([]);

      // Atualizar o estado com a nova ordem
      setTableState((prev) => ({
        ...prev,
        sorting: newOrder,
        pagination: { ...prev.pagination, pageIndex: 0 }
      }));

      // Resetar flags para garantir uma carga limpa
      fetchingRef.current = false;
      lastPageRequestedRef.current = 0;

      // Forçar reload após pequeno delay para permitir que a UI se atualize
      setTimeout(() => {
        fetchData(0, false);
      }, 10);
    },
    [fetchData]
  );

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
    goToPage,
    loadChunk,
    refetch,
    handleSort,
    handleFilter,
    handleResetFilters,
    reorderSorting,
    isManualFilterSortChange: isManualFilterSortChangeRef,
    setTableState: (updater: React.SetStateAction<TableState>) => {
      // Se a chamada a setTableState não estiver vindo de uma função interna que já tratou a flag,
      // vamos definir a flag de alteração manual como true
      isManualFilterSortChangeRef.current = true;

      // Chamar o setTableState original
      setTableState(updater);
    }
  };
}
