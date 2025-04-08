import { ArrowDown, ArrowUp, ArrowUpDown, Check, Filter } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { fetchUniqueValues } from "~/lib/services/api";
import type {
  ColumnDefinition,
  Filter as DataFilter,
  FilterOperator,
  SortingState,
} from "~/lib/types/data-table";
import { cn } from "~/lib/utils";

interface DataTableHeaderProps {
  column: ColumnDefinition;
  sorting: SortingState[];
  filters: DataFilter[];
  onSort: (columnId: string) => void;
  onFilter: (filter: DataFilter) => void;
  onRemoveFilter: (columnId: string, value: any) => void;
  endpoint: any;
  style?: React.CSSProperties;
}

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  column,
  sorting,
  filters,
  onSort,
  onFilter,
  onRemoveFilter,
  endpoint,
  style,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuReady, setMenuReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueValues, setUniqueValues] = useState<
    Array<{ value: any; label: string; count: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilterOperator, setSelectedFilterOperator] =
    useState<FilterOperator>("contains");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFilterValue, setDialogFilterValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterOptionsRef = useRef<HTMLDivElement>(null);

  // Verificar se há filtro ativo para esta coluna
  const hasActiveFilter = filters.some((f) => f.id === column.accessor);

  // Verificar quais valores estão selecionados
  useEffect(() => {
    const valuesForThisColumn = filters
      .filter((f) => f.id === column.accessor)
      .map((f) => f.value);
    setSelectedValues(valuesForThisColumn);
  }, [filters, column.accessor]);

  // Verificar o estado de ordenação atual da coluna
  const sortingState = sorting.find((s) => s.id === column.accessor);

  // Ícone de ordenação
  const renderSortIcon = () => {
    if (!column.sortable) return null;

    if (!sortingState) {
      return <ArrowUpDown className="text-muted-foreground ml-2 h-4 w-4" />;
    }

    return sortingState.desc ? (
      <ArrowDown className="text-primary ml-2 h-4 w-4" />
    ) : (
      <ArrowUp className="text-primary ml-2 h-4 w-4" />
    );
  };

  // Carregar valores únicos para filtro
  const loadUniqueValues = async (reset = false) => {
    if (!column.filterable) return;

    setIsLoading(true);
    try {
      const values = await fetchUniqueValues(
        endpoint,
        column.accessor,
        searchTerm
      );
      // Limitar a 10 valores iniciais ou adicionar aos existentes
      if (reset) {
        setUniqueValues(values.slice(0, 10));
      } else {
        const currentLength = uniqueValues.length;
        setUniqueValues((prev) => [
          ...prev,
          ...values.slice(currentLength, currentLength + 10),
        ]);
      }
    } catch (error) {
      console.error("Erro ao carregar valores únicos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar valores quando o termo de pesquisa muda
  useEffect(() => {
    if (menuOpen && column.filterable) {
      const timer = setTimeout(() => {
        loadUniqueValues(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [menuOpen, searchTerm, column.filterable]);

  // Função para lidar com o clique no cabeçalho
  const handleHeaderClick = () => {
    if (menuOpen) {
      // Se o menu já está aberto, apenas fechamos
      setMenuOpen(false);
      setMenuReady(false);
    } else {
      // Se o menu está fechado, definimos uma posição inicial baseada no header
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const menuWidth = 290;
        const estimatedMenuHeight = 350; // altura estimada do menu

        // Calcular uma posição inicial aproximada, considerando o scroll da página
        let initialLeft = rect.left;
        let initialTop = rect.bottom + window.scrollY + 2;

        // Verificar se o menu ultrapassaria a largura da tela
        if (initialLeft + menuWidth > windowWidth) {
          initialLeft = windowWidth - menuWidth - 10;
          if (initialLeft < 0) initialLeft = 0;
        }

        // Verificar se o menu vai ultrapassar a parte inferior da janela
        if (initialTop + estimatedMenuHeight > windowHeight + window.scrollY) {
          // Posicionar acima do header se não couber abaixo
          initialTop = rect.top - estimatedMenuHeight + window.scrollY;
          if (initialTop < window.scrollY) initialTop = window.scrollY + 5; // Não permitir que fique acima da janela
        }

        setPopoverPosition({
          top: initialTop,
          left: initialLeft + window.scrollX,
        });
      }

      // Define o menu como aberto e pronto em um mesmo ciclo de renderização
      setMenuOpen(true);
      setMenuReady(true);
    }
  };

  // Efeito para calcular a posição do popover (apenas ajustes finos agora)
  useEffect(() => {
    // Apenas monitorar mudanças de scroll ou resize para manter o menu na posição correta
    if (menuOpen && headerRef.current) {
      const handleResize = () => {
        const rect = headerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const menuWidth = 290; // Width of the menu as defined in the style

        // Posicionar diretamente abaixo do cabeçalho
        let top = rect.bottom + 2; // Margem mínima de 2px
        let left = rect.left;

        // Verificar se o menu vai ultrapassar a largura da tela
        if (left + menuWidth > windowWidth) {
          // Ajustar para que o menu fique totalmente visível
          left = windowWidth - menuWidth - 10; // 10px de margem da borda
          if (left < 0) left = 0; // Garantir que não fique fora da tela à esquerda
        }

        // Obter o container da tabela que pode estar com scroll
        const tableContainer = headerRef.current?.closest(".overflow-auto");
        const tableContainerRect = tableContainer?.getBoundingClientRect();
        const visibleBottom = tableContainerRect
          ? tableContainerRect.top + tableContainerRect.height
          : windowHeight;

        // Verificar se o menu vai ultrapassar a parte inferior visível do container
        const estimatedMenuHeight = 350; // altura estimada do menu
        if (top + estimatedMenuHeight > visibleBottom) {
          // Posicionar acima do header se não couber abaixo
          top = rect.top - estimatedMenuHeight;
          if (top < (tableContainerRect?.top ?? 0) || top < 0) {
            top = tableContainerRect?.top ?? 0;
          }
        }

        setPopoverPosition({
          top,
          left,
        });
      };

      // Escutar eventos de scroll e resize
      window.addEventListener("resize", handleResize);

      // Também escutar eventos de scroll no container da tabela
      const tableContainer = headerRef.current?.closest(".overflow-auto");
      if (tableContainer) {
        tableContainer.addEventListener("scroll", handleResize);
      }

      // Executar imediatamente para posicionar corretamente
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);

        // Limpar event listener do container da tabela
        if (tableContainer) {
          tableContainer.removeEventListener("scroll", handleResize);
        }
      };
    }
  }, [menuOpen]);

  // Efeito para atualizar a posição do submenu
  useEffect(() => {
    if (showFilterOptions && filterOptionsRef.current) {
      const updatePosition = () => {
        const rect = filterOptionsRef.current?.getBoundingClientRect();
        if (rect) {
          // Verificar se o menu ultrapassaria a largura da tela
          const proposedLeft = rect.right + 5;
          const menuWidth = 170; // Largura do menu em pixels
          const viewportWidth = window.innerWidth;

          // Se o menu ultrapassar a largura da tela, posicionar à esquerda
          const left =
            proposedLeft + menuWidth > viewportWidth
              ? rect.left - menuWidth - 5 // Posicionar à esquerda se não couber à direita
              : proposedLeft;

          // Garantir que o menu não fique parcialmente fora da tela à esquerda
          const adjustedLeft = Math.max(10, left); // Pelo menos 10px da borda esquerda

          // Verificar se o menu ultrapassaria a altura da tela
          const proposedTop = rect.top;
          const menuHeight = getFilterOptions().length * 30; // Altura estimada do menu
          const viewportHeight = window.innerHeight;

          // Ajustar posição vertical se necessário
          const top =
            proposedTop + menuHeight > viewportHeight
              ? viewportHeight - menuHeight - 10
              : proposedTop;

          setSubmenuPosition({
            top: Math.max(10, top), // Nunca ficar muito no topo
            left: adjustedLeft,
          });
        }
      };

      updatePosition();

      // Adicionar listener para atualizar quando o scroll mudar
      window.addEventListener("scroll", updatePosition);
      // Adicionar listener para atualizar quando o resize mudar
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [showFilterOptions]);

  // Aplicar filtro do diálogo
  const applyDialogFilter = () => {
    if (!dialogFilterValue) return;

    onFilter({
      id: column.accessor,
      operator: selectedFilterOperator,
      value: dialogFilterValue,
    });

    setDialogOpen(false);
    setDialogFilterValue("");
  };

  // Função para abrir o diálogo de filtro ao clicar em uma opção
  const openFilterDialog = (operator: FilterOperator) => {
    setSelectedFilterOperator(operator);
    setDialogFilterValue("");
    setDialogOpen(true);
    setShowFilterOptions(false);
  };

  // Aplicar filtro para um valor específico
  const toggleValueFilter = (value: any, e?: React.SyntheticEvent) => {
    // Impedir propagação e comportamento padrão do evento
    if (e) {
      e.stopPropagation();
      if ("preventDefault" in e) {
        e.preventDefault();
      }
    }

    const isSelected = selectedValues.some(
      (v) =>
        // Comparação mais robusta para diferentes tipos de valores
        v === value ||
        (typeof v === "object" &&
          typeof value === "object" &&
          JSON.stringify(v) === JSON.stringify(value))
    );

    if (isSelected) {
      // Remover este filtro específico
      onRemoveFilter(column.accessor, value);
    } else {
      // Adicionar novo filtro
      onFilter({
        id: column.accessor,
        operator: "exact",
        value: value,
      });
    }

    // Importante: Não fechar o menu para permitir seleção de múltiplos valores
  };

  // Remover filtro
  const removeFilter = () => {
    for (const filter of filters) {
      if (filter.id === column.accessor) {
        onRemoveFilter(column.accessor, filter.value);
      }
    }
    setMenuOpen(false);
  };

  // Aplicar ordenação
  const applySorting = (desc: boolean | null) => {
    if (!column.sortable) return;

    // Se o parâmetro desc é nulo, significa que queremos remover a ordenação
    if (desc === null) {
      onSort(`${column.accessor}:remove`);
      return;
    }

    // Ordenações são aplicadas em sequência:
    // 1. Sempre removemos qualquer ordenação existente primeiro
    if (sortingState) {
      onSort(`${column.accessor}:remove`);

      // Pequeno delay para garantir que a remoção seja processada antes da nova ordenação
      setTimeout(() => {
        // 2. Aplicamos a ordenação ascendente (padrão)
        onSort(column.accessor);

        // 3. Se a ordenação solicitada for descendente, aplicamos novamente para inverter
        if (desc) {
          setTimeout(() => onSort(column.accessor), 50);
        }
      }, 50);
    } else {
      // Se não havia ordenação anterior, podemos simplesmente aplicar direto
      onSort(column.accessor); // Isso aplica ASC

      // Se queremos DESC, temos que chamar novamente para inverter
      if (desc) {
        setTimeout(() => onSort(column.accessor), 50);
      }
    }
  };

  // Opções de filtro baseadas no tipo de coluna
  const getFilterOptions = () => {
    switch (column.type) {
      case "number":
        return [
          { label: "Igual a", value: "exact" as FilterOperator },
          { label: "Maior que", value: "gt" as FilterOperator },
          { label: "Maior ou igual a", value: "gte" as FilterOperator },
          { label: "Menor que", value: "lt" as FilterOperator },
          { label: "Menor ou igual a", value: "lte" as FilterOperator },
        ];
      case "date":
        return [
          { label: "Igual a", value: "date" as FilterOperator },
          { label: "Depois de", value: "gt" as FilterOperator },
          { label: "Antes de", value: "lt" as FilterOperator },
        ];
      case "boolean":
        return [
          { label: "É verdadeiro", value: "exact" as FilterOperator },
          { label: "É falso", value: "exact" as FilterOperator },
        ];
      default:
        return [
          { label: "Contém", value: "contains" as FilterOperator },
          { label: "Começa com", value: "startswith" as FilterOperator },
          { label: "Termina com", value: "endswith" as FilterOperator },
          { label: "Igual a", value: "exact" as FilterOperator },
        ];
    }
  };

  // Verifica se há mais valores para carregar ao rolar
  const handleScroll = () => {
    if (!scrollAreaRef.current || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8) {
      loadUniqueValues();
    }
  };

  // Verifica se um valor está selecionado
  const isValueSelected = (value: any) => {
    return selectedValues.some((v) => v === value);
  };

  // Fechar popover quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Não fechar o menu se o clique foi dentro do header, área de rolagem ou menu de opções
      const clickedInsideHeader =
        headerRef.current?.contains(event.target as Node) || false;
      const clickedInsideScrollArea =
        scrollAreaRef.current?.contains(event.target as Node) || false;
      const clickedInsideFilterOptions =
        filterOptionsRef.current?.contains(event.target as Node) || false;

      if (
        menuOpen &&
        !clickedInsideHeader &&
        !clickedInsideScrollArea &&
        !clickedInsideFilterOptions
      ) {
        setMenuOpen(false);
        setShowFilterOptions(false);
        setMenuReady(false);
      }
    };

    // Usar mousedown para capturar o evento antes que outros handlers possam ser acionados
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      ref={headerRef}
      className="bg-muted/40 relative flex items-center justify-between border-r px-4 py-1 select-none last:border-r-0"
      style={style}
    >
      <div className="w-full">
        <Button
          ref={buttonRef}
          variant="ghost"
          size="sm"
          className={cn(
            "hover:bg-muted flex w-full items-center justify-between px-3 py-1 text-left",
            hasActiveFilter && "text-primary font-medium"
          )}
          onClick={handleHeaderClick}
          title={column.header}
        >
          <span className="flex-1 truncate pr-2 text-left">
            {column.header}
          </span>
          <div className="flex flex-shrink-0 items-center">
            {renderSortIcon()}
            {hasActiveFilter && (
              <Filter className="text-primary ml-1 h-3 w-3" />
            )}
          </div>
        </Button>

        {/* O menu com transição suave para evitar o 'piscar' */}
        <div
          className={cn(
            "bg-popover fixed z-50 rounded-md border shadow-lg transition-opacity duration-75",
            menuOpen && menuReady
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          )}
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            width: "240px",
            maxHeight: "90vh",
            overflowY: "auto",
            maxWidth: "calc(100vw - 20px)",
          }}
        >
          <div className="bg-muted/20 border-b p-1.5 text-sm font-semibold">
            {column.header}
          </div>
          <div className="p-1.5">
            {/* Opções de ordenação */}
            {column.sortable && (
              <div className="space-y-0.5">
                <Button
                  variant={
                    sortingState && !sortingState.desc ? "secondary" : "ghost"
                  }
                  size="sm"
                  className={`relative h-7 w-full justify-start pl-8 text-xs ${
                    sortingState && !sortingState.desc
                      ? "bg-primary/20 font-medium"
                      : ""
                  }`}
                  onClick={() => applySorting(false)}
                >
                  {sortingState && !sortingState.desc && (
                    <Check className="text-primary absolute left-2 h-3 w-3" />
                  )}
                  <ArrowUp
                    className={`mr-2 h-3 w-3 ${sortingState && !sortingState.desc ? "text-primary" : ""}`}
                  />
                  <span>Ordenar de A a Z</span>
                </Button>
                <Button
                  variant={
                    sortingState && sortingState.desc ? "secondary" : "ghost"
                  }
                  size="sm"
                  className={`relative h-7 w-full justify-start pl-8 text-xs ${
                    sortingState && sortingState.desc
                      ? "bg-primary/20 font-medium"
                      : ""
                  }`}
                  onClick={() => applySorting(true)}
                >
                  {sortingState && sortingState.desc && (
                    <Check className="text-primary absolute left-2 h-3 w-3" />
                  )}
                  <ArrowDown
                    className={`mr-2 h-3 w-3 ${sortingState && sortingState.desc ? "text-primary" : ""}`}
                  />
                  <span>Ordenar de Z a A</span>
                </Button>
              </div>
            )}

            {/* Opções de filtro */}
            {column.filterable && (
              <>
                <div className="mt-2 mb-1">
                  <div className="my-1.5 border-t" />
                  <div className="mb-1 text-xs font-medium">Filtros</div>

                  {/* Filtros avançados - movidos para cima */}
                  <div
                    className="relative mb-2"
                    ref={filterOptionsRef}
                    onMouseEnter={() => {
                      if (filterOptionsRef.current) {
                        const rect =
                          filterOptionsRef.current.getBoundingClientRect();
                        setSubmenuPosition({
                          top: 0, // Posicionar no topo do botão
                          left: rect.width + 5, // Posicionar à direita do botão com um pequeno espaço
                        });
                      }
                      setShowFilterOptions(true);
                    }}
                    onMouseLeave={() => {
                      // Usar timeout para permitir que o mouse se mova para o submenu
                      setTimeout(() => {
                        if (
                          !document.querySelector(
                            ".filter-options-submenu:hover"
                          )
                        ) {
                          setShowFilterOptions(false);
                        }
                      }, 100);
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-full justify-between text-xs"
                      onClick={() => setShowFilterOptions(!showFilterOptions)}
                    >
                      Filtros avançados
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>

                    {/* Submenu de opções de filtro */}
                    {showFilterOptions && (
                      <>
                        {/* Área "ponte" invisível para facilitar o mouse se mover entre botão e submenu */}
                        <div
                          className="hover-bridge fixed z-50"
                          style={{
                            top: `${popoverPosition.top + 30}px`,
                            left: `${popoverPosition.left + 220}px`,
                            width: "30px",
                            height: "150px",
                            // backgroundColor: "rgba(255,0,0,0.1)", // Descomente para debug
                          }}
                          onMouseOver={() => setShowFilterOptions(true)}
                          onMouseEnter={() => setShowFilterOptions(true)}
                        />

                        <div
                          className="bg-background filter-options-submenu fixed z-50 rounded border shadow-md"
                          style={{
                            top: `${popoverPosition.top + 50}px`,
                            left: `${popoverPosition.left + 245}px`,
                            width: "180px",
                            padding: "4px 0",
                          }}
                          onMouseEnter={() => setShowFilterOptions(true)}
                          onMouseLeave={() => setShowFilterOptions(false)}
                        >
                          {getFilterOptions().map((option, index) => (
                            <div
                              key={index}
                              className="hover:bg-muted cursor-pointer px-2 py-1.5 text-xs"
                              onClick={() => openFilterDialog(option.value)}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Campo de pesquisa */}
                  <div className="relative">
                    <input
                      type="text"
                      className="bg-background focus:ring-primary w-full rounded border p-1.5 text-xs focus:ring-1 focus:outline-none"
                      placeholder="Pesquisar valores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Lista de valores únicos */}
                  <div
                    className="bg-background mt-2 max-h-[150px] overflow-y-auto rounded border"
                    ref={scrollAreaRef}
                    onScroll={handleScroll}
                  >
                    {isLoading && uniqueValues.length === 0 ? (
                      <div className="text-muted-foreground flex items-center justify-center p-4 text-xs">
                        Carregando valores...
                      </div>
                    ) : uniqueValues.length === 0 ? (
                      <div className="text-muted-foreground p-2 text-center text-xs">
                        Nenhum valor encontrado
                      </div>
                    ) : (
                      uniqueValues.map((item, index) => (
                        <div
                          key={index}
                          className={`hover:bg-muted flex cursor-pointer items-center px-2 py-1.5 text-xs ${
                            isValueSelected(item.value) ? "bg-primary/10" : ""
                          }`}
                          onClick={(e) => toggleValueFilter(item.value, e)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                              isValueSelected(item.value)
                                ? "bg-primary border-primary"
                                : "border-gray-300"
                            )}
                          >
                            {isValueSelected(item.value) && (
                              <Check className="text-primary-foreground h-3 w-3" />
                            )}
                          </div>
                          <span className="flex-1 truncate">
                            {item.label || String(item.value)}
                            {item.count > 1 && (
                              <span className="text-muted-foreground ml-1">
                                ({item.count})
                              </span>
                            )}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Remover filtros ativos */}
                {hasActiveFilter && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive w-full justify-start text-xs"
                      onClick={removeFilter}
                    >
                      Remover filtros para {column.header}
                    </Button>
                  </div>
                )}

                {/* Diálogo para filtros personalizados */}
                {dialogOpen && (
                  <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-background w-[300px] max-w-[90vw] rounded-md border p-4 shadow-lg">
                      <h3 className="mb-3 text-sm font-medium">
                        Filtro personalizado
                      </h3>
                      <input
                        type="text"
                        className="bg-background mb-3 w-full rounded border p-2 text-sm"
                        placeholder="Digite o valor..."
                        value={dialogFilterValue}
                        onChange={(e) => setDialogFilterValue(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={applyDialogFilter}>
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableHeader;
