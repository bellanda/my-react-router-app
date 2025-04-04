import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor para exibição com base no tipo
 */
export function formatDisplayValue(value: any, type: "number" | "boolean" | "currency" | "date" | "datetime"): string {
  if (value === null || value === undefined) {
    return "-";
  }

  switch (type) {
    case "number":
      return Number(value).toLocaleString("pt-BR");
    case "boolean":
      return value ? "Sim" : "Não";
    case "currency":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(Number(value));
    case "date":
      return new Date(value).toLocaleDateString("pt-BR");
    case "datetime":
      return new Date(value).toLocaleString("pt-BR");
    default:
      return String(value);
  }
}

/**
 * Gera um identificador único
 */
export function uniqueId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Determina o tipo de uma coluna com base no nome e valor
 */
export function inferColumnType(columnName: string, sampleValue: any): string {
  if (sampleValue === null || sampleValue === undefined) {
    // Tentar inferir pelo nome
    if (/date|data|dt_|created_at|updated_at/.test(columnName.toLowerCase())) {
      return "date";
    }

    if (/price|valor|preco|custo|montante/.test(columnName.toLowerCase())) {
      return "currency";
    }

    if (/percentage|percentual|percent/.test(columnName.toLowerCase())) {
      return "percentage";
    }

    if (/is_|active|status|enabled/.test(columnName.toLowerCase())) {
      return "boolean";
    }

    return "text";
  }

  // Inferir pelo valor
  if (typeof sampleValue === "number") {
    if (/price|valor|preco|custo|montante/.test(columnName.toLowerCase())) {
      return "currency";
    }

    if (/percentage|percentual|percent/.test(columnName.toLowerCase())) {
      return "percentage";
    }

    return "number";
  }

  if (typeof sampleValue === "boolean") {
    return "boolean";
  }

  if (sampleValue instanceof Date) {
    return "date";
  }

  if (typeof sampleValue === "string") {
    // Verificar se é data
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(sampleValue)) {
      return "datetime";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(sampleValue)) {
      return "date";
    }
  }

  return "text";
}

export function formatFilterValue(value: any, type: string): any {
  if (value === null || value === undefined) {
    return null;
  }

  switch (type) {
    case "number":
      return Number(value);
    case "boolean":
      return Boolean(value);
    case "date":
    case "datetime":
      if (typeof value === "string") {
        return value;
      }
      return new Date(value).toISOString();
    default:
      return String(value);
  }
}

export function getUniqueValues(data: any[], accessor: string): any[] {
  const valueSet = new Set<any>();

  // Lidar com acessores aninhados (por exemplo, 'additional_info.total_stock')
  const accessorParts = accessor.split(".");

  data.forEach((item) => {
    let value = item;
    for (const part of accessorParts) {
      if (value && typeof value === "object") {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }

    if (value !== undefined && value !== null) {
      valueSet.add(value);
    }
  });

  return Array.from(valueSet).sort((a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(a).localeCompare(String(b));
  });
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function parseQueryParams(search: string): Record<string, string> {
  if (!search || search === "?") return {};

  const params = new URLSearchParams(search.startsWith("?") ? search.substring(1) : search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

export function buildQueryString(params: Record<string, any>): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function extractNestedValue(obj: any, path: string): any {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = current[part];
  }

  return current;
}
