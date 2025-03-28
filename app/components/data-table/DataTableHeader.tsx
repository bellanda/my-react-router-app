import React, { useState, useEffect, useRef } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Check, ChevronRight, Search } from "lucide-react";
import type { ColumnDefinition, SortingState, Filter as DataFilter, FilterOperator } from "../../lib/types/data-table";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { fetchUniqueValues } from "../../lib/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

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
  style
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueValues, setUniqueValues] = useState<Array<{ value: any; label: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilterOperator, setSelectedFilterOperator] = useState<FilterOperator>("contains");
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
    const valuesForThisColumn = filters.filter((f) => f.id === column.accessor).map((f) => f.value);
    setSelectedValues(valuesForThisColumn);
  }, [filters, column.accessor]);

  // Verificar o estado de ordenação atual da coluna
  const sortingState = sorting.find((s) => s.id === column.accessor);

  // Ícone de ordenação
  const renderSortIcon = () => {
    if (!column.sortable) return null;

    if (!sortingState) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }

    return sortingState.desc ? (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    );
  };

  // Carregar valores únicos para filtro
  const loadUniqueValues = async (reset = false) => {
    if (!column.filterable) return;

    setIsLoading(true);
    try {
      const values = await fetchUniqueValues(endpoint, column.accessor, searchTerm);
      // Limitar a 10 valores iniciais ou adicionar aos existentes
      if (reset) {
        setUniqueValues(values.slice(0, 10));
      } else {
        const currentLength = uniqueValues.length;
        setUniqueValues((prev) => [...prev, ...values.slice(currentLength, currentLength + 10)]);
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
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [menuOpen, searchTerm, column.filterable]);

  // Efeito para calcular a posição do popover
  useEffect(() => {
    if (menuOpen && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Verificar se o menu vai ultrapassar a parte inferior da janela
      let top = rect.bottom + window.scrollY;
      if (top + 400 > windowHeight + window.scrollY) {
        // 400 é uma estimativa da altura do menu
        // Posicionar acima do header se não couber abaixo
        top = rect.top - 400 + window.scrollY;
        if (top < window.scrollY) top = window.scrollY; // Não permitir que fique acima da janela
      }

      setPopoverPosition({
        top,
        left: rect.left + window.scrollX
      });
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
          const left = proposedLeft + menuWidth > viewportWidth ? rect.left - menuWidth - 5 : proposedLeft;

          // Verificar se o menu ultrapassaria a altura da tela
          const proposedTop = rect.top;
          const menuHeight = getFilterOptions().length * 30; // Altura estimada do menu
          const viewportHeight = window.innerHeight;

          // Ajustar posição vertical se necessário
          const top = proposedTop + menuHeight > viewportHeight ? viewportHeight - menuHeight - 10 : proposedTop;

          setSubmenuPosition({
            top: Math.max(10, top), // Nunca ficar muito no topo
            left
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

  // Função para lidar com o clique no cabeçalho
  const handleHeaderClick = () => {
    setMenuOpen((prev) => !prev);
  };

  // Aplicar filtro do diálogo
  const applyDialogFilter = () => {
    if (!dialogFilterValue) return;

    onFilter({
      id: column.accessor,
      operator: selectedFilterOperator,
      value: dialogFilterValue
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
  const toggleValueFilter = (value: any) => {
    const isSelected = selectedValues.some((v) => v === value);

    if (isSelected) {
      // Remover este filtro específico
      const updatedFilters = filters.filter((f) => !(f.id === column.accessor && f.value === value));

      // Se removemos todos os filtros para esta coluna
      if (!updatedFilters.some((f) => f.id === column.accessor)) {
        onRemoveFilter(column.accessor, value);
      } else {
        // Atualizar o estado com a lista de filtros atualizada
        onFilter({
          id: column.accessor,
          operator: "exact", // Usar um operador padrão para sinalizar atualização
          value: "__UPDATE_FILTERS__",
          _updatedFilters: updatedFilters // Passar os filtros atualizados
        });
      }
    } else {
      // Adicionar novo filtro
      onFilter({
        id: column.accessor,
        operator: selectedFilterOperator,
        value: value
      });
    }
  };

  // Remover filtro
  const removeFilter = () => {
    onRemoveFilter(column.accessor, null);
    setMenuOpen(false);
  };

  // Aplicar ordenação
  const applySorting = (desc: boolean | null) => {
    console.log("DataTableHeader.applySorting:", { desc, sortingState });

    // Limpar ordenação explicitamente
    if (desc === null) {
      if (sortingState) {
        onSort(column.accessor + ":remove");
      }
      return;
    }

    // Caso A: Usuário clicou no botão A-Z
    if (desc === false) {
      // Se já está em A-Z, remover ordenação
      if (sortingState && !sortingState.desc) {
        onSort(column.accessor + ":remove");
      } else {
        // Se não existe ordenação ou está em Z-A, definir para A-Z
        onSort(column.accessor + ":asc");
      }
      return;
    }

    // Caso B: Usuário clicou no botão Z-A
    if (desc === true) {
      // Se já está em Z-A, remover ordenação
      if (sortingState && sortingState.desc) {
        onSort(column.accessor + ":remove");
      } else {
        // Se não existe ordenação ou está em A-Z, definir para Z-A
        onSort(column.accessor + ":desc");
      }
      return;
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
          { label: "Menor ou igual a", value: "lte" as FilterOperator }
        ];
      case "date":
        return [
          { label: "Igual a", value: "date" as FilterOperator },
          { label: "Depois de", value: "gt" as FilterOperator },
          { label: "Antes de", value: "lt" as FilterOperator }
        ];
      case "boolean":
        return [
          { label: "É verdadeiro", value: "exact" as FilterOperator },
          { label: "É falso", value: "exact" as FilterOperator }
        ];
      default:
        return [
          { label: "Contém", value: "contains" as FilterOperator },
          { label: "Começa com", value: "startswith" as FilterOperator },
          { label: "Termina com", value: "endswith" as FilterOperator },
          { label: "Igual a", value: "exact" as FilterOperator }
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
      if (
        menuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node) &&
        scrollAreaRef.current &&
        !scrollAreaRef.current.contains(event.target as Node) &&
        filterOptionsRef.current &&
        !filterOptionsRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setShowFilterOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      ref={headerRef}
      className="flex items-center justify-between border-r last:border-r-0 py-2 px-4 select-none bg-muted/40 relative"
      style={style}
    >
      <div className="w-full">
        <Button
          ref={buttonRef}
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center justify-start w-full px-1 hover:bg-muted",
            hasActiveFilter && "text-primary font-medium"
          )}
          onClick={handleHeaderClick}
        >
          <span className="flex items-center">
            {column.header}
            {renderSortIcon()}
            {hasActiveFilter && <Filter className="ml-2 h-3 w-3 text-primary" />}
          </span>
        </Button>

        {menuOpen && (
          <div
            className="fixed shadow-lg rounded-md border bg-popover z-50"
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
              width: "290px",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div className="p-1.5 font-semibold border-b bg-muted/20 text-sm">{column.header}</div>
            <div className="p-1.5 space-y-2">
              {/* Opções de ordenação */}
              {column.sortable && (
                <div className="space-y-0.5">
                  <Button
                    variant={sortingState && !sortingState.desc ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start pl-8 relative h-8 text-xs ${
                      sortingState && !sortingState.desc ? "bg-primary/20 font-medium" : ""
                    }`}
                    onClick={() => applySorting(false)}
                  >
                    {sortingState && !sortingState.desc && <Check className="h-3 w-3 absolute left-2 text-primary" />}
                    <ArrowUp className={`mr-2 h-3 w-3 ${sortingState && !sortingState.desc ? "text-primary" : ""}`} />
                    <span>Ordenar de A a Z</span>
                  </Button>
                  <Button
                    variant={sortingState && sortingState.desc ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start pl-8 relative h-8 text-xs ${
                      sortingState && sortingState.desc ? "bg-primary/20 font-medium" : ""
                    }`}
                    onClick={() => applySorting(true)}
                  >
                    {sortingState && sortingState.desc && <Check className="h-3 w-3 absolute left-2 text-primary" />}
                    <ArrowDown className={`mr-2 h-3 w-3 ${sortingState && sortingState.desc ? "text-primary" : ""}`} />
                    <span>Ordenar de Z a A</span>
                  </Button>
                  {sortingState && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start pl-8 relative h-8 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => applySorting(null)}
                    >
                      <ArrowUpDown className="mr-2 h-3 w-3" />
                      <span>Limpar ordenação</span>
                    </Button>
                  )}
                  {column.filterable && <Separator className="my-1" />}
                </div>
              )}

              {/* Opções de filtro */}
              {column.filterable && (
                <div>
                  {/* Menu dropdown para filtros de texto com hover */}
                  <div ref={filterOptionsRef} className="relative">
                    <div
                      className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => setShowFilterOptions(!showFilterOptions)}
                      onMouseEnter={() => setShowFilterOptions(true)}
                    >
                      <span className="font-medium text-sm">
                        Filtros de {column.type === "number" ? "número" : column.type === "date" ? "data" : "texto"}
                      </span>
                      <ChevronRight className="h-3 w-3" />
                    </div>

                    {/* Menu de opções de filtro que aparece ao passar o mouse */}
                    {showFilterOptions && (
                      <div
                        className="fixed shadow-md rounded-md border bg-popover z-50"
                        style={{
                          width: "170px",
                          zIndex: 61,
                          top: submenuPosition.top,
                          left: submenuPosition.left
                        }}
                        onMouseLeave={() => setShowFilterOptions(false)}
                        onMouseEnter={() => setShowFilterOptions(true)}
                      >
                        <div className="p-1">
                          {getFilterOptions().map((option, idx) => (
                            <div
                              key={idx}
                              className="px-2 py-1.5 text-sm hover:bg-muted cursor-pointer rounded-sm"
                              onClick={() => openFilterDialog(option.value)}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-1.5" />

                  {/* Barra de pesquisa de valores */}
                  <div className="relative mt-1.5">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Pesquisar valores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-7 pl-8 text-sm"
                    />
                  </div>

                  {/* Lista de valores únicos para seleção */}
                  <div ref={scrollAreaRef} className="h-[140px] overflow-auto border rounded-md mt-1.5" onScroll={handleScroll}>
                    {isLoading && uniqueValues.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground">Carregando...</span>
                      </div>
                    ) : uniqueValues.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground">Nenhum valor encontrado</span>
                      </div>
                    ) : (
                      <div className="px-1">
                        {uniqueValues.map((item, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center px-2 py-1 text-sm hover:bg-muted cursor-pointer",
                              isValueSelected(item.value) && "bg-primary/20"
                            )}
                            onClick={() => toggleValueFilter(item.value)}
                          >
                            <input
                              type="checkbox"
                              checked={isValueSelected(item.value)}
                              onChange={() => {}}
                              className="mr-2 h-3 w-3"
                            />
                            <span className="flex-1 truncate">{item.label === null ? "(Vazio)" : item.label}</span>
                            <span className="text-muted-foreground text-xs">{item.count}</span>
                          </div>
                        ))}
                        {isLoading && uniqueValues.length > 0 && (
                          <div className="text-center py-1 text-sm text-muted-foreground">Carregando mais...</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões de ação */}
                  <div className="mt-2">
                    {hasActiveFilter && (
                      <Button variant="outline" size="sm" className="w-full h-7 text-sm" onClick={removeFilter}>
                        Limpar Filtro
                      </Button>
                    )}
                    <Button variant="default" size="sm" className="w-full h-7 text-sm" onClick={() => setMenuOpen(false)}>
                      Fechar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diálogo para adicionar filtro */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                Filtrar {column.header} - {getFilterOptions().find((opt) => opt.value === selectedFilterOperator)?.label}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="text"
                placeholder={`Digite o valor para filtrar...`}
                value={dialogFilterValue}
                onChange={(e) => setDialogFilterValue(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyDialogFilter();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={applyDialogFilter}>Aplicar Filtro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DataTableHeader;
