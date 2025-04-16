"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { fetchUniqueValues } from "~/lib/services/api";
import type {
  ColumnDefinition,
  FilterOperator,
  UniqueValueOption,
} from "~/lib/types/data-table";

// Operadores de filtro por tipo de coluna
const FILTER_OPERATORS: Record<string, FilterOperator[]> = {
  text: ["contains", "exact", "startswith", "endswith", "isnull", "in"],
  number: ["exact", "lt", "lte", "gt", "gte", "range", "isnull", "in"],
  date: [
    "exact",
    "lt",
    "lte",
    "gt",
    "gte",
    "range",
    "year",
    "month",
    "day",
    "isnull",
    "in",
  ],
  datetime: [
    "exact",
    "lt",
    "lte",
    "gt",
    "gte",
    "range",
    "date",
    "year",
    "month",
    "day",
    "isnull",
    "in",
  ],
  boolean: ["exact", "isnull", "in"],
};

// Rótulos amigáveis para operadores
const OPERATOR_LABELS: Record<string, string> = {
  exact: "Igual a",
  contains: "Contém",
  startswith: "Começa com",
  endswith: "Termina com",
  lt: "Menor que",
  lte: "Menor ou igual a",
  gt: "Maior que",
  gte: "Maior ou igual a",
  range: "Entre",
  date: "Data exata",
  year: "Ano",
  month: "Mês",
  day: "Dia",
  week: "Semana",
  isnull: "É nulo",
  in: "Em",
};

interface ColumnFilterProps {
  column: ColumnDefinition;
  onFilterChange?: (filter: any) => void;
  onClose: () => void;
  endpoint?: any;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  column,
  onFilterChange,
  onClose,
  endpoint,
}) => {
  console.log(`Inicializando ColumnFilter para ${column.header}`, {
    type: column.type,
    accessor: column.accessor,
  });

  // Estado para operador selecionado
  const [operator, setOperator] = React.useState<FilterOperator>(
    FILTER_OPERATORS[column.type][0]
  );

  // Estado para valores de filtro (diferente por tipo)
  const [filterValue, setFilterValue] = React.useState<any>(null);

  // Estado para valores de intervalo de data
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );

  // Para valores numéricos em intervalo
  const [rangeValues, setRangeValues] = React.useState<[any, any]>([
    null,
    null,
  ]);

  // Para seleção de valores únicos
  const [selectedUniqueValues, setSelectedUniqueValues] = React.useState<
    string[]
  >([]);
  const [uniqueValueOpen, setUniqueValueOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [uniqueValues, setUniqueValues] = React.useState<UniqueValueOption[]>(
    []
  );

  // Referência para o input
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Foco automático no input quando componente é montado
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Carregar valores únicos ao montar o componente
  React.useEffect(() => {
    const loadUniqueValues = async () => {
      if (
        column.type === "text" ||
        column.type === "date" ||
        column.type === "datetime"
      ) {
        try {
          console.log(
            `Carregando valores únicos para ${column.header} (${column.accessor}), tipo: ${column.type}, operador: ${operator}`
          );

          // Forçar o tipo correto
          const columnType = column.type;

          const values = await fetchUniqueValues(
            endpoint || { url: "/api/products" },
            column.accessor,
            searchTerm,
            columnType
          );
          console.log(
            `Valores únicos carregados para ${column.header}:`,
            values
          );
          setUniqueValues(values);

          // Resetar valores selecionados quando mudamos a lista de valores disponíveis
          setSelectedUniqueValues([]);
        } catch (error) {
          console.error(
            `Erro ao carregar valores únicos para ${column.header}:`,
            error
          );
        }
      }
    };

    loadUniqueValues();
  }, [
    column.accessor,
    column.type,
    searchTerm,
    endpoint,
    column.header,
    operator,
  ]);

  // Lista de operadores disponíveis
  const operatorOptions = FILTER_OPERATORS[column.type];

  // Aplicar filtro
  const applyFilter = () => {
    if (!onFilterChange) return;

    let value;
    if (operator === "range") {
      if (column.type === "date" || column.type === "datetime") {
        if (dateRange?.from && dateRange?.to) {
          // Formatação correta para YYYY-MM-DD sem timezone
          const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          };

          value = [formatDate(dateRange.from), formatDate(dateRange.to)];
        } else {
          value = null;
        }
      } else {
        value = rangeValues;
      }
    } else if (operator === "isnull") {
      value = true;
    } else if (operator === "in" && selectedUniqueValues.length > 0) {
      // Usar os valores selecionados (não precisamos converter, pois já estão no formato correto)
      value = selectedUniqueValues;
    } else if (
      (column.type === "date" || column.type === "datetime") &&
      filterValue
    ) {
      if (
        operator === "year" ||
        operator === "month" ||
        operator === "day" ||
        operator === "week"
      ) {
        // Para operadores de parte de data, extrair a parte correspondente
        const date = new Date(filterValue);
        if (operator === "year") {
          value = date.getFullYear();
        } else if (operator === "month") {
          value = date.getMonth() + 1; // JavaScript meses são 0-11
        } else if (operator === "day") {
          value = date.getDate();
        } else if (operator === "week") {
          // Implementar cálculo da semana se necessário
          value = 1; // Placeholder
        }
      } else {
        // Formatação correta para YYYY-MM-DD sem usar timezone
        const date = new Date(filterValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        value = `${year}-${month}-${day}`;
      }
    } else {
      value = filterValue;
    }

    console.log(
      `Aplicando filtro para ${column.accessor} (${column.type}): ${operator} = `,
      value
    );

    // Garantir que não enviamos valores nulos ou undefined para filtros que não sejam isnull
    if ((value === null || value === undefined) && operator !== "isnull") {
      console.log("Ignorando filtro com valor nulo ou undefined");
      onClose();
      return;
    }

    // Criar filtro com o tipo de campo explícito para permitir processamento correto
    const filter = {
      id: column.accessor,
      operator,
      value,
      _fieldType: column.type,
    };

    console.log("Filtro final enviado:", filter);

    onFilterChange(filter);

    onClose();
  };

  // Lidar com a tecla Enter para aplicar o filtro
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilter();
    }
  };

  // Componente DatePicker para data única
  const DatePickerSingle = () => {
    // Função para formatar a data para YYYY-MM-DD local
    const handleDateSelect = (date: Date | undefined) => {
      if (!date) {
        setFilterValue(null);
        return;
      }

      console.log("Data selecionada no calendário:", date);

      // Armazenar o objeto Date para uso nos campos de filtro
      setFilterValue(date);
    };

    return (
      <div className="space-y-2">
        <Calendar
          mode="single"
          selected={filterValue}
          onSelect={handleDateSelect}
          initialFocus
          className="rounded-md border"
        />
        {filterValue && (
          <div className="text-muted-foreground mt-1 text-xs">
            Data selecionada: {new Date(filterValue).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  // Componente DatePicker para intervalo de datas
  const DatePickerRange = () => {
    const handleDateRangeSelect = (range: DateRange | undefined) => {
      setDateRange(range);

      if (range?.from && range?.to) {
        console.log("Intervalo de datas selecionado:", {
          from: range.from,
          to: range.to,
        });
      }
    };

    return (
      <div className="flex flex-col justify-center space-y-2">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateRangeSelect}
          numberOfMonths={2}
          className="mx-auto rounded-md border"
        />
        {dateRange?.from && dateRange?.to && (
          <div className="text-center text-sm">
            {dateRange.from.toLocaleDateString()} até{" "}
            {dateRange.to.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  // Renderizar o campo de entrada com base no tipo e operador
  const renderInputField = () => {
    console.log(
      `Renderizando campo de entrada para ${column.header} (${column.type}), operador: ${operator}`
    );
    console.log(`Valores únicos disponíveis: ${uniqueValues.length}`);

    if (operator === "isnull") {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id="is-null-switch"
            checked={filterValue === true}
            onCheckedChange={(checked: boolean) => setFilterValue(checked)}
          />
          <Label htmlFor="is-null-switch">É nulo</Label>
        </div>
      );
    }

    switch (column.type) {
      case "text":
        // Para valores únicos, exibimos o seletor de múltiplos
        if (uniqueValues && uniqueValues.length > 0) {
          console.log("Renderizando seletor de valores únicos para texto");
          return (
            <Popover open={uniqueValueOpen} onOpenChange={setUniqueValueOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={uniqueValueOpen}
                  className="w-full justify-between"
                >
                  {selectedUniqueValues.length === 0
                    ? "Selecione valores..."
                    : `${selectedUniqueValues.length} selecionado(s)`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar valores..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandEmpty>Nenhum valor encontrado.</CommandEmpty>
                  <CommandGroup>
                    {uniqueValues.map((item: UniqueValueOption) => (
                      <CommandItem
                        key={String(item.value)}
                        value={String(item.value)}
                        onSelect={() => {
                          const valueStr = String(item.value);
                          setSelectedUniqueValues((prev) =>
                            prev.includes(valueStr)
                              ? prev.filter((v) => v !== valueStr)
                              : [...prev, valueStr]
                          );
                        }}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedUniqueValues.includes(
                              String(item.value)
                            )}
                            className="mr-2"
                          />
                          <span>{item.label}</span>
                          <span className="text-muted-foreground ml-auto">
                            ({item.count})
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          );
        } else {
          console.log("Renderizando input de texto");
          return (
            <Input
              type="text"
              value={filterValue || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterValue(e.target.value)
              }
              placeholder="Digite o valor..."
              className="w-full"
              ref={inputRef}
              onKeyDown={handleKeyDown}
            />
          );
        }

      case "number":
        if (operator === "range") {
          return (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={rangeValues[0] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRangeValues([e.target.value, rangeValues[1]])
                }
                placeholder="De"
                className="w-full"
                ref={inputRef}
                onKeyDown={handleKeyDown}
              />
              <span>-</span>
              <Input
                type="number"
                value={rangeValues[1] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRangeValues([rangeValues[0], e.target.value])
                }
                placeholder="Até"
                className="w-full"
                onKeyDown={handleKeyDown}
              />
            </div>
          );
        }

        return (
          <Input
            type="number"
            value={filterValue || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilterValue(e.target.value)
            }
            placeholder="Digite o valor..."
            className="w-full"
            ref={inputRef}
            onKeyDown={handleKeyDown}
          />
        );

      case "date":
      case "datetime":
        // Se estamos usando operador "in" e temos valores únicos, mostrar o seletor
        if (operator === "in" && uniqueValues && uniqueValues.length > 0) {
          console.log(
            `Renderizando seletor de valores únicos para ${column.type}`,
            uniqueValues
          );
          return (
            <Popover open={uniqueValueOpen} onOpenChange={setUniqueValueOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={uniqueValueOpen}
                  className="w-full justify-between"
                >
                  {selectedUniqueValues.length === 0
                    ? "Selecione valores..."
                    : `${selectedUniqueValues.length} selecionado(s)`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar datas..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandEmpty>Nenhuma data encontrada.</CommandEmpty>
                  <CommandGroup>
                    {uniqueValues.map((item: UniqueValueOption) => (
                      <CommandItem
                        key={String(item.value)}
                        value={String(item.value)}
                        onSelect={() => {
                          const valueStr = String(item.value);
                          setSelectedUniqueValues((prev) =>
                            prev.includes(valueStr)
                              ? prev.filter((v) => v !== valueStr)
                              : [...prev, valueStr]
                          );
                        }}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedUniqueValues.includes(
                              String(item.value)
                            )}
                            className="mr-2"
                          />
                          <span>{item.label}</span>
                          <span className="text-muted-foreground ml-auto">
                            ({item.count})
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          );
        } else if (operator === "range") {
          console.log(`Renderizando seletor de intervalo para ${column.type}`);
          return <DatePickerRange />;
        } else if (["year", "month", "day", "week"].includes(operator)) {
          // Para operadores de parte de data, mostrar input numérico
          console.log(`Renderizando input numérico para ${operator}`);
          return (
            <Input
              type="number"
              value={filterValue || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterValue(parseInt(e.target.value, 10))
              }
              placeholder={`Digite o ${OPERATOR_LABELS[operator].toLowerCase()}...`}
              className="w-full"
              ref={inputRef}
              min={operator === "year" ? 1900 : operator === "month" ? 1 : 1}
              max={
                operator === "year"
                  ? 2100
                  : operator === "month"
                    ? 12
                    : operator === "day"
                      ? 31
                      : 53
              }
              onKeyDown={handleKeyDown}
            />
          );
        } else {
          console.log(`Renderizando calendário para ${column.type}`);
          return <DatePickerSingle />;
        }

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="boolean-value"
              checked={filterValue === true}
              onCheckedChange={(checked: boolean) => setFilterValue(checked)}
            />
            <Label htmlFor="boolean-value">Verdadeiro</Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">{column.header}</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="filter-operator">Operador</Label>
          <select
            id="filter-operator"
            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            value={operator}
            onChange={(e) => {
              const newOperator = e.target.value as FilterOperator;
              console.log(
                `Operador alterado: ${operator} -> ${newOperator} para coluna tipo ${column.type}`
              );
              setOperator(newOperator);
              // Limpar valores quando o operador muda
              setFilterValue(null);
              setDateRange(undefined);
              setRangeValues([null, null]);
              setSelectedUniqueValues([]);
            }}
          >
            {operatorOptions.map((op: FilterOperator) => (
              <option key={op} value={op}>
                {OPERATOR_LABELS[op]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Valor</Label>
          {renderInputField()}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={applyFilter}>Aplicar</Button>
      </div>
    </div>
  );
};

export default ColumnFilter;
