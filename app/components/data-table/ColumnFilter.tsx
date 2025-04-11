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
  date: ["exact", "lt", "lte", "gt", "gte", "range", "isnull", "in"],
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
      if (column.type === "text") {
        try {
          const values = await fetchUniqueValues(
            endpoint || { url: "/api/products" },
            column.accessor,
            searchTerm
          );
          setUniqueValues(values);
        } catch (error) {
          console.error("Erro ao carregar valores únicos:", error);
        }
      }
    };

    loadUniqueValues();
  }, [column.accessor, column.type, searchTerm, endpoint]);

  // Lista de operadores disponíveis
  const operatorOptions = FILTER_OPERATORS[column.type];

  // Aplicar filtro
  const applyFilter = () => {
    if (!onFilterChange) return;

    let value;
    if (operator === "range") {
      if (column.type === "date") {
        if (dateRange?.from && dateRange?.to) {
          // Enviar apenas a parte da data como strings no formato YYYY-MM-DD
          const fromDate = new Date(dateRange.from);
          const toDate = new Date(dateRange.to);

          value = [
            fromDate.toISOString().split("T")[0],
            toDate.toISOString().split("T")[0],
          ];
        } else {
          value = null;
        }
      } else {
        value = rangeValues;
      }
    } else if (operator === "isnull") {
      value = true;
    } else if (column.type === "text" && selectedUniqueValues.length > 0) {
      value = selectedUniqueValues;
    } else if (column.type === "date" && filterValue) {
      // Enviar apenas a parte da data como string no formato YYYY-MM-DD
      const date = new Date(filterValue);
      value = date.toISOString().split("T")[0];
    } else {
      value = filterValue;
    }

    onFilterChange({
      id: column.accessor,
      operator,
      value,
    });

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
    return (
      <div className="space-y-2">
        <Calendar
          mode="single"
          selected={filterValue}
          onSelect={setFilterValue}
          initialFocus
          className="rounded-md border"
        />
      </div>
    );
  };

  // Componente DatePicker para intervalo de datas
  const DatePickerRange = () => {
    return (
      <div className="flex flex-col justify-center space-y-2">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          className="mx-auto rounded-md border"
        />
        {dateRange?.from && dateRange?.to && (
          <div className="text-center text-sm">
            {dateRange.from.toISOString().split("T")[0]} até{" "}
            {dateRange.to.toISOString().split("T")[0]}
          </div>
        )}
      </div>
    );
  };

  // Renderizar o campo de entrada com base no tipo e operador
  const renderInputField = () => {
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
        if (operator === "range") {
          return <DatePickerRange />;
        }
        return <DatePickerSingle />;

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
            onChange={(e) => setOperator(e.target.value as FilterOperator)}
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
