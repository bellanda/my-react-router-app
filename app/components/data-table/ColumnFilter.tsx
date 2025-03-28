import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import type { ColumnDefinition, FilterOperator, UniqueValueOption } from "../../lib/types/data-table";
import { fetchUniqueValues } from "../../lib/services/api";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

// Operadores de filtro por tipo de coluna
const FILTER_OPERATORS: Record<string, FilterOperator[]> = {
  text: ["contains", "exact", "startswith", "endswith", "isnull"],
  number: ["exact", "lt", "lte", "gt", "gte", "range", "isnull"],
  date: ["exact", "lt", "lte", "gt", "gte", "range", "isnull"],
  boolean: ["exact", "isnull"],
  foreignKey: ["exact", "isnull"],
  object: [],
  auto: []
};

// Rótulos amigáveis para operadores
const OPERATOR_LABELS: Record<FilterOperator, string> = {
  exact: "Igual a",
  iexact: "Igual a (ignora maiúsculas)",
  contains: "Contém",
  icontains: "Contém (ignora maiúsculas)",
  startswith: "Começa com",
  istartswith: "Começa com (ignora maiúsculas)",
  endswith: "Termina com",
  iendswith: "Termina com (ignora maiúsculas)",
  regex: "Regex",
  iregex: "Regex (ignora maiúsculas)",
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
  isnull: "É nulo"
};

interface ColumnFilterProps {
  column: ColumnDefinition;
  onFilterChange?: (filter: any) => void;
  onClose: () => void;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ column, onFilterChange, onClose }) => {
  // Estado para operador selecionado
  const [operator, setOperator] = useState<FilterOperator>(column.filterOperators?.[0] || FILTER_OPERATORS[column.type][0]);

  // Estado para valores de filtro (diferente por tipo)
  const [filterValue, setFilterValue] = useState<any>(null);
  const [rangeValues, setRangeValues] = useState<[any, any]>([null, null]);

  // Para seleção de valores únicos
  const [selectedUniqueValues, setSelectedUniqueValues] = useState<string[]>([]);
  const [uniqueValueOpen, setUniqueValueOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar valores únicos da coluna
  const { data: uniqueValues } = useQuery({
    queryKey: ["uniqueValues", column.accessor, searchTerm],
    queryFn: () => fetchUniqueValues({ url: "/api/products" }, column.accessor, searchTerm),
    enabled: column.type === "text" || column.type === "foreignKey"
  });

  // Lista de operadores disponíveis
  const operatorOptions = column.filterOperators || FILTER_OPERATORS[column.type];

  // Aplicar filtro
  const applyFilter = () => {
    if (!onFilterChange) return;

    let value;
    if (operator === "range") {
      value = rangeValues;
    } else if (operator === "isnull") {
      value = true;
    } else {
      value = filterValue;
    }

    onFilterChange({
      id: column.accessor,
      operator,
      value
    });

    onClose();
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
        return (
          <Input
            type="text"
            value={filterValue || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
            placeholder="Digite o valor..."
            className="w-full"
          />
        );

      case "number":
        if (operator === "range") {
          return (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={rangeValues[0] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRangeValues([e.target.value, rangeValues[1]])}
                placeholder="De"
                className="w-full"
              />
              <span>-</span>
              <Input
                type="number"
                value={rangeValues[1] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRangeValues([rangeValues[0], e.target.value])}
                placeholder="Até"
                className="w-full"
              />
            </div>
          );
        }

        return (
          <Input
            type="number"
            value={filterValue || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
            placeholder="Digite o valor..."
            className="w-full"
          />
        );

      case "date":
        if (operator === "range") {
          return (
            <div className="grid grid-cols-2 gap-2">
              <DatePicker
                value={rangeValues[0]}
                onChange={(date: Date) => setRangeValues([date, rangeValues[1]])}
                placeholder="Data inicial"
              />
              <DatePicker
                value={rangeValues[1]}
                onChange={(date: Date) => setRangeValues([rangeValues[0], date])}
                placeholder="Data final"
              />
            </div>
          );
        }

        return <DatePicker value={filterValue} onChange={setFilterValue} placeholder="Selecione a data..." />;

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

      case "foreignKey":
        return (
          <Popover open={uniqueValueOpen} onOpenChange={setUniqueValueOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={uniqueValueOpen} className="w-full justify-between">
                {selectedUniqueValues.length === 0 ? "Selecione valores..." : `${selectedUniqueValues.length} selecionado(s)`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Buscar valores..." value={searchTerm} onValueChange={setSearchTerm} />
                <CommandEmpty>Nenhum valor encontrado.</CommandEmpty>
                <CommandGroup>
                  {uniqueValues?.map((item: UniqueValueOption) => (
                    <CommandItem
                      key={String(item.value)}
                      value={String(item.value)}
                      onSelect={() => {
                        const valueStr = String(item.value);
                        setSelectedUniqueValues((prev) =>
                          prev.includes(valueStr) ? prev.filter((v) => v !== valueStr) : [...prev, valueStr]
                        );
                      }}
                    >
                      <div className="flex items-center">
                        <Checkbox checked={selectedUniqueValues.includes(String(item.value))} className="mr-2" />
                        <span>{item.label}</span>
                        <span className="ml-auto text-muted-foreground">({item.count})</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={operator}
            onChange={(e) => setOperator(e.target.value as FilterOperator)}
          >
            {operatorOptions.map((op) => (
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
