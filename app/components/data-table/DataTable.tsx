import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTableHeader from "~/components/data-table/DataTableHeader";
import FilterPanel from "~/components/data-table/FilterPanel";
import SortingPanel from "~/components/data-table/SortingPanel";
import { fetchTableData } from "~/lib/services/api";
import type {
  ApiResult,
  ColumnDefinition,
  DjangoApiResponse,
  Filter,
  SortingState,
  TableConfig,
  TableState
} from "~/lib/types/data-table";
import { cn } from "~/lib/utils";

interface DataTableProps {
  config: TableConfig;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({ config, className }) => {
  // Load previous state from sessionStorage if exists
  const loadSavedState = (): TableState | null => {
    try {
      // Verificar se está no navegador antes de acessar sessionStorage
      if (typeof window === "undefined") return null;

      const storageKey = `data-table-state-${config.endpoint.url}`;
      const savedState = sessionStorage.getItem(storageKey);

      if (savedState) {
        const parsed = JSON.parse(savedState);

        // Garantir que a estrutura do estado está correta
        if (parsed && Array.isArray(parsed.sorting)) {
          // Manter a consistência das ordenações
          const validSorting = parsed.sorting.filter((sort: any) => sort && typeof sort === "object" && sort.id && "desc" in sort);

          return {
            filters: Array.isArray(parsed.filters) ? parsed.filters : [],
            sorting: validSorting,
            pagination: {
              pageIndex: parsed.pagination?.pageIndex || 0,
              pageSize: parsed.pagination?.pageSize || config.defaultPageSize || 20
            }
          };
        }
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
    return {
      filters: [],
      sorting: [], // Sem ordenação padrão
      pagination: {
        pageIndex: 0,
        pageSize: config.defaultPageSize || 20
      }
    };
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

  // Referência para o container de scroll
  const containerRef = useRef<HTMLDivElement>(null);

  // Referência para o elemento "Scroll para ver mais"
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Flags para evitar requisições duplicadas
  const fetchingRef = useRef(false);
  const initialLoadDoneRef = useRef(false);

  // Flag para verificação de preenchimento inicial da tela
  const initialScreenCheckRef = useRef(false);

  // Referência estável para o estado atual
  const stableTableState = useRef(tableState);

  // Referência para controlar mudanças manuais de filtro/ordenação
  const manualFilterSortChangeRef = useRef(false);

  // Referência para a próxima e anterior URL (para cursor pagination)
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  // Atualizar a ref quando o tableState muda
  useEffect(() => {
    stableTableState.current = tableState;
  }, [tableState]);

  // Função para buscar dados
  const fetchData = useCallback(
    async (page: number, append = false) => {
      // Se já estamos carregando dados, não iniciar nova requisição
      if (isLoading || isFetchingMore) {
        console.log(`Já existe um carregamento em andamento, ignorando nova requisição`);
        return;
      }

      // Definir flag para evitar mais requisições enquanto esta estiver em andamento
      fetchingRef.current = true;

      try {
        // Se não houver mais páginas e estamos anexando, não fazer nada
        if (append && !hasNextPage) {
          console.log("Não há mais páginas para carregar");
          return;
        }

        // Atualizar estado de carregamento
        if (append) {
          setIsFetchingMore(true);
        } else {
          setIsLoading(true);
        }

        // Usar a versão mais recente do estado
        const currentState = stableTableState.current;

        // Se estamos usando cursor pagination e temos uma URL next ou previous
        let fullUrl: string | null = null;
        if (append && nextUrl) {
          fullUrl = nextUrl;
        } else if (!append && page < currentState.pagination.pageIndex && previousUrl) {
          fullUrl = previousUrl;
        }

        // Se temos uma URL completa de cursor pagination, usar diretamente
        let response: ApiResult<any>;
        if (fullUrl) {
          // Extrair apenas o caminho e query da URL completa
          const url = new URL(fullUrl);
          const pathWithQuery = url.pathname + url.search;

          // Buscar dados diretamente com essa URL
          const res = await fetch(pathWithQuery);
          if (!res.ok) {
            throw new Error(`Erro ao buscar dados: ${res.status}`);
          }

          // Converter a resposta do Django para o formato interno
          const djangoResponse = (await res.json()) as DjangoApiResponse<any>;

          // Formatar resposta no formato esperado pelo componente
          response = {
            data: djangoResponse.results || [],
            totalCount: djangoResponse.count || 0,
            pageCount: Math.ceil((djangoResponse.count || 0) / currentState.pagination.pageSize),
            meta: {
              start: page * currentState.pagination.pageSize,
              end: page * currentState.pagination.pageSize + (djangoResponse.results?.length || 0),
              pageSize: currentState.pagination.pageSize,
              pageIndex: page,
              hasNextPage: !!djangoResponse.next,
              hasPreviousPage: !!djangoResponse.previous,
              next: djangoResponse.next,
              previous: djangoResponse.previous
            }
          };
        } else {
          // Se não temos URL completa, usar a função de fetch regular
          response = await fetchTableData(
            config.endpoint,
            currentState.filters,
            currentState.sorting,
            page,
            currentState.pagination.pageSize
          );
        }

        // Atualizar as URLs de paginação para o cursor
        setNextUrl(response.meta?.next || null);
        setPreviousUrl(response.meta?.previous || null);

        // Verificar se temos dados para adicionar
        if (response.data.length === 0) {
          setHasNextPage(false);
        } else if (append) {
          // Adicionar dados ao estado existente
          setData((prev) => {
            return [...prev, ...response.data];
          });
        } else {
          // Substituir dados existentes
          setData(response.data);
        }

        // Atualizar metadados
        setTotalPages(response.pageCount);
        setTotalItems(response.totalCount);

        // Verificar se há mais páginas
        const hasMore = response.meta?.hasNextPage || (page < response.pageCount - 1 && response.data.length > 0);
        setHasNextPage(hasMore);

        setIsError(false);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Erro ao buscar dados"));
        if (!append) {
          setData([]);
        }
      } finally {
        // Limpar estados de carregamento
        setIsLoading(false);
        setIsFetchingMore(false);

        // Resetar flag de requisição em andamento
        fetchingRef.current = false;
      }
    },
    [config.endpoint, hasNextPage, isLoading, isFetchingMore, nextUrl, previousUrl]
  );

  // Carregar dados iniciais
  useEffect(() => {
    if (initialLoadDoneRef.current) return;

    // Verificar se estamos restaurando um estado com ordenações válidas
    if (tableState.sorting.length > 0) {
      console.log(
        "Restaurando estado da tabela com ordenações:",
        tableState.sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(", ")
      );
    }

    // Garantir que o estado seja consistente antes da primeira carga
    const consistentState = {
      ...tableState,
      sorting: tableState.sorting.map((sort) => ({
        id: sort.id,
        desc: Boolean(sort.desc)
      })),
      pagination: {
        ...tableState.pagination,
        pageIndex: 0 // Sempre começar da primeira página no carregamento inicial
      }
    };

    // Atualizar o estado apenas se diferente
    if (JSON.stringify(consistentState) !== JSON.stringify(tableState)) {
      setTableState(consistentState);
    }

    // Marcar como inicializado imediatamente para evitar múltiplas cargas
    initialLoadDoneRef.current = true;

    // Carregar primeira página
    fetchData(0, false);
  }, [fetchData, tableState]);

  // Atualizar ao mudar filtros ou ordenação
  useEffect(() => {
    // Ignorar primeiro render
    if (!initialLoadDoneRef.current) return;

    // Ignorar se não foi uma alteração manual de filtro/ordenação
    if (!manualFilterSortChangeRef.current) {
      return;
    }

    // Resetar flag após processar
    manualFilterSortChangeRef.current = false;

    // Debounce para evitar múltiplas requisições rápidas
    const timeoutId = setTimeout(() => {
      // Não iniciar nova requisição se já houver uma em andamento
      if (isLoading || isFetchingMore) {
        return;
      }

      // Resetar para a primeira página
      setTableState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          pageIndex: 0
        }
      }));

      // Limpar dados atuais
      setData([]);

      // Carregar nova página 0
      fetchData(0, false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [tableState.filters, tableState.sorting, fetchData, isLoading, isFetchingMore]);

  // Função para detectar necessidade de carregar mais dados
  const loadMoreData = useCallback(() => {
    // Não carregar se já estiver carregando, não houver próxima página, ou requisição em andamento
    if (isLoading || isFetchingMore || !hasNextPage || fetchingRef.current) {
      return;
    }

    // Carregar próxima página
    const nextPage = stableTableState.current.pagination.pageIndex + 1;

    // Atualizar página atual
    setTableState((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: nextPage
      }
    }));

    // Carregar próxima página, anexando ao conteúdo existente
    fetchData(nextPage, true);
  }, [fetchData, hasNextPage, isLoading, isFetchingMore]);

  // Configurar o detector de scroll
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    // Evitar múltiplos eventos de scroll em curto espaço de tempo
    let scrollTimeout: number | null = null;

    // Handler que detecta quando o usuário está próximo do final
    const handleScroll = () => {
      if (isLoading || isFetchingMore || !hasNextPage || fetchingRef.current || data.length >= totalItems) return;

      // Limpar timeout anterior para evitar múltiplas chamadas
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Definir um novo timeout para processar o scroll após pausa breve
      scrollTimeout = window.setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;

        // Carregar mais dados quando estiver a 200px do final
        if (scrollBottom < 200) {
          loadMoreData();
        }
      }, 100);
    };

    // Adicionar detector de scroll
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [loadMoreData, hasNextPage, isLoading, isFetchingMore, data.length, totalItems]);

  // Verificar se precisa carregar mais dados quando a tela não está preenchida
  useEffect(() => {
    // Se já verificamos, ou não temos dados, ou não temos mais páginas, não fazer nada
    if (
      initialScreenCheckRef.current ||
      !initialLoadDoneRef.current ||
      !hasNextPage ||
      isLoading ||
      isFetchingMore ||
      fetchingRef.current ||
      data.length === 0 ||
      data.length >= totalItems
    ) {
      return;
    }

    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    // Marcar que já fizemos a verificação
    initialScreenCheckRef.current = true;

    // Verificar uma única vez com delay adequado para garantir que os elementos foram renderizados
    const timeoutId = window.setTimeout(() => {
      // Verificar se o conteúdo preenche o container
      const { scrollHeight, clientHeight } = scrollContainer;

      if (scrollHeight <= clientHeight) {
        // Chamar a função que foi passada como dependência
        loadMoreData();
      }
    }, 100); // Reduzido para 500ms para melhor responsividade

    // Limpar o timeout se o componente desmontar
    return () => clearTimeout(timeoutId);
  }, [data.length, hasNextPage, isLoading, isFetchingMore, loadMoreData, totalItems]);

  // Usar Intersection Observer para detectar quando o elemento "Scroll para ver mais" aparece na tela
  useEffect(() => {
    // Se não tiver mais páginas ou já estiver carregando, não configurar o observer
    if (!hasNextPage || isLoading || isFetchingMore || fetchingRef.current) return;

    // Elemento que queremos observar
    const loadMoreElement = loadMoreTriggerRef.current;
    if (!loadMoreElement) return;

    // Função chamada quando o elemento entra/sai da viewport
    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isLoading && !isFetchingMore && !fetchingRef.current) {
        loadMoreData();
      }
    };

    // Criar e configurar o observer
    const observer = new IntersectionObserver(onIntersect, {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.1 // 10% do elemento visível é suficiente
    });

    // Iniciar observação
    observer.observe(loadMoreElement);

    // Limpar observer ao desmontar
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, isFetchingMore, loadMoreData]);

  // Manipuladores para ordenação
  const handleSort = useCallback((columnId: string) => {
    // Marcar que é uma alteração manual
    manualFilterSortChangeRef.current = true;

    // Verificar se temos um comando especial de ordenação
    if (columnId.includes(":")) {
      const [realColumnId, command] = columnId.split(":");

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

      // Adicionar nova ordenação
      return {
        ...prev,
        sorting: [...prev.sorting, { id: columnId, desc: false }],
        pagination: { ...prev.pagination, pageIndex: 0 }
      };
    });
  }, []);

  // Manipulador para filtros
  const handleFilter = useCallback((filter: Filter & { _updatedFilters?: Filter[] }) => {
    // Marcar que é uma alteração manual
    manualFilterSortChangeRef.current = true;

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
      const existingFilterIndex = prev.filters.findIndex(
        (f) => f.id === filter.id && f.operator === filter.operator && f.value === filter.value
      );

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
    // Marcar que é uma alteração manual
    manualFilterSortChangeRef.current = true;

    setTableState((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => !(f.id === columnId && f.value === value)),
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Limpar todos os filtros
  const handleClearAllFilters = useCallback(() => {
    // Marcar que é uma alteração manual
    manualFilterSortChangeRef.current = true;

    setTableState((prev) => ({
      ...prev,
      filters: [],
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Limpar todas as ordenações
  const handleClearAllSorts = useCallback(() => {
    // Marcar que é uma alteração manual
    manualFilterSortChangeRef.current = true;

    setTableState((prev) => ({
      ...prev,
      sorting: [],
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Remover ordenação específica
  const handleRemoveSort = useCallback((columnId: string) => {
    // Marcar que é uma alteração manual
    manualFilterSortChangeRef.current = true;

    setTableState((prev) => ({
      ...prev,
      sorting: prev.sorting.filter((s) => s.id !== columnId),
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Reordenar ordenações
  const handleReorderSorts = useCallback((newOrder: SortingState[]) => {
    // Marcar que é uma alteração manual
    manualFilterSortChangeRef.current = true;

    setTableState((prev) => ({
      ...prev,
      sorting: newOrder,
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }, []);

  // Calcular colunas visíveis e largura das células
  const visibleColumns = useMemo(() => config.columns.filter((col) => !col.hidden), [config.columns]);
  const columnCount = visibleColumns.length;

  // Definir larguras das colunas com base no tipo e configuração
  const getColumnWidth = useCallback((column: ColumnDefinition) => {
    // Se a coluna tem uma largura explícita, usar essa
    if (column.width) return column.width;

    // Caso contrário, calcular com base no tipo de dados
    switch (column.type) {
      case "boolean":
        return "100px";
      case "number":
        return "120px";
      case "date":
        return "160px";
      case "text":
      default:
        // Para colunas de texto, verificar se o accessor indica um campo que tende a ser maior
        if (column.accessor.includes("description")) return "300px";
        if (column.accessor.includes("name") || column.accessor.includes("email")) return "200px";
        if (column.accessor.includes("id")) return "100px";
        return "180px"; // largura padrão para outras colunas de texto
    }
  }, []);

  // Memoizar cabeçalho da tabela
  const headerComponent = useMemo(() => {
    return (
      <div className="flex border-b w-full">
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
            style={{ width: getColumnWidth(column), minWidth: getColumnWidth(column) }}
          />
        ))}
      </div>
    );
  }, [
    visibleColumns,
    tableState.sorting,
    tableState.filters,
    getColumnWidth,
    handleSort,
    handleFilter,
    handleRemoveFilter,
    config.endpoint
  ]);

  // Memoizar linhas da tabela
  const rowsComponent = useMemo(() => {
    return data.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} className={cn("flex border-b w-full", rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20")}>
        {visibleColumns.map((column) => {
          // Suporte a accessors aninhados
          const keys = column.accessor.split(".");
          let value = row;
          for (const key of keys) {
            value = value?.[key];
          }

          const displayValue = column.formatFn ? column.formatFn(value) : value;

          return (
            <div
              key={`${rowIndex}-${column.accessor}`}
              className="py-2 px-4 overflow-hidden text-ellipsis whitespace-nowrap text-sm"
              style={{
                width: getColumnWidth(column),
                minWidth: getColumnWidth(column)
              }}
              title={String(displayValue)}
            >
              {displayValue}
            </div>
          );
        })}
      </div>
    ));
  }, [data, visibleColumns, getColumnWidth]);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    try {
      // Verificar se está no navegador antes de acessar sessionStorage
      if (typeof window === "undefined") return;

      const storageKey = `data-table-state-${config.endpoint.url}`;

      // Certificar-se de que temos um estado válido e consistente para salvar
      const stateToSave = {
        filters: tableState.filters || [],
        sorting: (tableState.sorting || []).map((sort) => ({
          id: sort.id,
          desc: Boolean(sort.desc)
        })),
        pagination: {
          pageIndex: tableState.pagination.pageIndex || 0,
          pageSize: tableState.pagination.pageSize || config.defaultPageSize || 20
        }
      };

      sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving table state:", e);
    }
  }, [tableState, config.endpoint.url]);

  // Renderizar componente
  return (
    <div className={cn("flex flex-col border rounded-md w-full", className)}>
      {/* Painéis de filtro e ordenação */}
      {tableState.filters.length > 0 && (
        <FilterPanel
          filters={tableState.filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
          columns={config.columns}
        />
      )}

      {tableState.sorting.length > 0 && (
        <SortingPanel
          sorting={tableState.sorting}
          onRemoveSort={handleRemoveSort}
          onClearAllSorts={handleClearAllSorts}
          onReorderSorts={handleReorderSorts}
          columns={config.columns}
        />
      )}

      {/* Container principal - sem altura fixa ou scroll próprio */}
      <div ref={containerRef} className="w-full relative">
        {/* Cabeçalho da tabela - fixo na parte superior */}
        <div className="sticky top-0 z-10 bg-background shadow-sm">{headerComponent}</div>

        {/* Corpo da tabela */}
        {isLoading && data.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
              <span className="text-muted-foreground">Carregando...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-destructive">Erro ao carregar dados: {error?.message}</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted">Nenhum dado encontrado</div>
          </div>
        ) : (
          <>
            {rowsComponent}
            {isFetchingMore && (
              <div className="py-4 text-center">
                <div className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Carregando mais...</span>
                </div>
              </div>
            )}
            {/* Indicador de final da lista com mais dados - com ref para detecção */}
            {data.length > 0 && hasNextPage && !isFetchingMore && !isLoading && (
              <div
                ref={loadMoreTriggerRef}
                className="py-4 text-center text-sm text-muted-foreground cursor-pointer hover:bg-muted/20"
                onClick={loadMoreData}
              >
                Clique para carregar mais itens ou continue rolando
              </div>
            )}
          </>
        )}
      </div>

      {/* Barra de status */}
      <div className="px-4 py-2 border-t bg-muted/20 text-sm flex justify-between">
        <div>
          {totalItems > 0
            ? `${data.length} de ${totalItems} itens carregados${
                hasNextPage ? " (Role para carregar mais)" : " (Todos carregados)"
              }`
            : "0 itens"}
        </div>
        <div className="flex items-center gap-2">
          {isLoading || isFetchingMore ? (
            <div className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span className="text-muted-foreground">{isLoading ? "Carregando..." : "Carregando mais itens..."}</span>
            </div>
          ) : hasNextPage ? (
            <div className="text-blue-500 text-xs">Scroll para ver mais</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
