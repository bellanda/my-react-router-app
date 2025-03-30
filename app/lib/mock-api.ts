import type { Filter, SortingState } from "./types/data-table";

// Dados de exemplo para produtos
export const mockProducts = Array.from({ length: 500 }).map((_, index) => ({
  id: index + 1,
  group__name: ["Hardware", "Software", "Periféricos", "Componentes", "Acessórios"][Math.floor(Math.random() * 5)],
  category__name: [
    "Placa-mãe",
    "Processador",
    "Memória",
    "Armazenamento",
    "Gabinete",
    "Refrigeração",
    "Monitor",
    "Teclado",
    "Mouse"
  ][Math.floor(Math.random() * 9)],
  brand__name: ["ASUS", "Dell", "HP", "Lenovo", "Apple", "Samsung", "Gigabyte", "Intel", "AMD", "Nvidia"][
    Math.floor(Math.random() * 10)
  ],
  model__name: `Modelo ${100 + index}`,
  compatible_brand__name: ["ASUS", "Dell", "HP", "Lenovo", "Apple", "Samsung", "Gigabyte", "Intel", "AMD", "Nvidia"][
    Math.floor(Math.random() * 10)
  ],
  compatible_model__name: `Compatível ${200 + index}`,
  color__name: ["Preto", "Branco", "Azul", "Vermelho", "Verde", "Amarelo", "Cinza"][Math.floor(Math.random() * 7)],
  min_stock: Math.floor(Math.random() * 10) + 1,
  max_stock: Math.floor(Math.random() * 50) + 20,
  price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
  warranty_period: [30, 60, 90, 180, 365][Math.floor(Math.random() * 5)],
  is_active: Math.random() > 0.2,
  description: `Descrição completa do produto ${index + 1} com todas as especificações técnicas e informações relevantes.`,
  short_description: `Produto ${index + 1} - versão resumida`,
  created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updated_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  created_by__email: ["admin@example.com", "user1@example.com", "user2@example.com"][Math.floor(Math.random() * 3)],
  additional_info: {
    total_stock_quantity: Math.floor(Math.random() * 100) + 1,
    total_sold_quantity: Math.floor(Math.random() * 500),
    total_sold_value: parseFloat((Math.random() * 50000).toFixed(2)),
    daily_sales_average_last_30_days: parseFloat((Math.random() * 10).toFixed(2))
  }
}));

// Interface para o tipo de produto
export interface Product {
  id: number;
  [key: string]: any;
}

// Interface para valor único
export interface UniqueValue {
  value: any;
  count: number;
}

// Função para obter valores únicos de uma coluna, com contagem
export function getUniqueFieldValues(data: any[], fieldId: string, searchTerm?: string): UniqueValue[] {
  try {
    // Mapear valores do campo
    const values = data.map((item) => {
      const keys = fieldId.split(".");
      let value = item;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined || value === null) break;
      }

      return value;
    });

    // Agrupar e contar valores
    const valueCounts = values.reduce((acc: Record<string, number>, value: any) => {
      // Converter para string para usar como chave
      const key = value !== null && value !== undefined ? String(value) : "__null__";

      // Filtrar pelo termo de pesquisa, se fornecido
      if (searchTerm && value && !String(value).toLowerCase().includes(searchTerm.toLowerCase())) {
        return acc;
      }

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Converter para array de objetos e ordenar
    const result = Object.entries(valueCounts).map(([key, count]) => ({
      value: key === "__null__" ? null : determineValueType(key),
      count
    }));

    // Ordenar por contagem (decrescente)
    return result.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Erro ao obter valores únicos:", error);
    return [];
  }
}

// Função auxiliar para determinar o tipo de valor (número, booleano, string)
function determineValueType(value: string): any {
  // Tentar converter para número
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  // Verificar se é booleano
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;

  // Caso contrário, manter como string
  return value;
}

// Função para filtrar um array com base em filtros
function applyFilters<T>(data: T[], filters: Filter[]): T[] {
  if (!filters.length) return data;

  // Agrupar filtros por ID (coluna)
  const filtersByColumn: Record<string, Filter[]> = {};

  filters.forEach((filter) => {
    if (!filtersByColumn[filter.id]) {
      filtersByColumn[filter.id] = [];
    }
    filtersByColumn[filter.id].push(filter);
  });

  return data.filter((item) => {
    // O item deve satisfazer cada coluna de filtro
    return Object.keys(filtersByColumn).every((columnId) => {
      const columnFilters = filtersByColumn[columnId];

      // Separar filtros por tipo de operador
      const exactFilters = columnFilters.filter((f) => f.operator === "exact");
      const textFilters = columnFilters.filter((f) => ["contains", "startswith", "endswith"].includes(f.operator));
      const numericFilters = columnFilters.filter((f) => ["gt", "gte", "lt", "lte"].includes(f.operator));
      const otherFilters = columnFilters.filter(
        (f) => !["exact", "contains", "startswith", "endswith", "gt", "gte", "lt", "lte"].includes(f.operator)
      );

      // Verificações combinadas:
      // 1. Se houver filtros "exact", pelo menos um deve ser verdadeiro (OR)
      const exactFiltersPass =
        exactFilters.length === 0 ||
        exactFilters.some((filter) => {
          const { id, value } = filter;

          // Lidar com acessores aninhados
          const keys = id.split(".");
          let itemValue = item as any;
          for (const key of keys) {
            itemValue = itemValue?.[key];
            if (itemValue === undefined || itemValue === null) {
              return filter.operator === "isnull";
            }
          }

          return itemValue == value;
        });

      // 2. Se houver filtros de texto (contains, startswith, endswith), todos devem ser verdadeiros (AND)
      const textFiltersPass =
        textFilters.length === 0 ||
        textFilters.every((filter) => {
          const { id, operator, value } = filter;

          // Lidar com acessores aninhados
          const keys = id.split(".");
          let itemValue = item as any;
          for (const key of keys) {
            itemValue = itemValue?.[key];
            if (itemValue === undefined || itemValue === null) {
              return operator === "isnull";
            }
          }

          switch (operator) {
            case "contains":
              return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
            case "startswith":
              return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
            case "endswith":
              return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
            default:
              return true;
          }
        });

      // 3. Filtros numéricos já usam AND
      const numericFiltersPass =
        numericFilters.length === 0 ||
        numericFilters.every((filter) => {
          const { id, operator, value } = filter;

          // Lidar com acessores aninhados
          const keys = id.split(".");
          let itemValue = item as any;
          for (const key of keys) {
            itemValue = itemValue?.[key];
            if (itemValue === undefined || itemValue === null) {
              return operator === "isnull";
            }
          }

          switch (operator) {
            case "lt":
              return itemValue < value;
            case "lte":
              return itemValue <= value;
            case "gt":
              return itemValue > value;
            case "gte":
              return itemValue >= value;
            default:
              return true;
          }
        });

      // 4. Para outros filtros, usar a abordagem padrão (OR)
      const otherFiltersPass =
        otherFilters.length === 0 ||
        otherFilters.some((filter) => {
          const { id, operator, value } = filter;

          // Lidar com acessores aninhados
          const keys = id.split(".");
          let itemValue = item as any;
          for (const key of keys) {
            itemValue = itemValue?.[key];
            if (itemValue === undefined || itemValue === null) {
              return operator === "isnull";
            }
          }

          switch (operator) {
            case "range":
              if (Array.isArray(value) && value.length === 2) {
                return itemValue >= value[0] && itemValue <= value[1];
              }
              return true;
            case "isnull":
              return itemValue === null || itemValue === undefined;
            default:
              return true;
          }
        });

      // O resultado final é a combinação de todas as verificações
      return exactFiltersPass && textFiltersPass && numericFiltersPass && otherFiltersPass;
    });
  });
}

// Função para ordenar um array com base em estados de ordenação
function applySorting<T>(data: T[], sorting: SortingState[]): T[] {
  if (!sorting.length) return data;

  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const { id, desc } = sort;

      // Lidar com acessores aninhados
      const keys = id.split(".");

      let aValue: any = a;
      let bValue: any = b;

      for (const key of keys) {
        aValue = aValue?.[key];
        bValue = bValue?.[key];
      }

      // Se os valores são undefined ou null
      if (aValue === undefined || aValue === null) {
        return desc ? 1 : -1;
      }
      if (bValue === undefined || bValue === null) {
        return desc ? -1 : 1;
      }

      // Comparação com base nos tipos
      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.localeCompare(bValue);
        if (result !== 0) {
          return desc ? -result : result;
        }
      } else {
        if (aValue < bValue) {
          return desc ? 1 : -1;
        }
        if (aValue > bValue) {
          return desc ? -1 : 1;
        }
      }
    }
    return 0;
  });
}

// Função para paginar um array
function applyPagination<T>(data: T[], pageIndex: number, pageSize: number): T[] {
  const start = pageIndex * pageSize;

  // Certificar que não ultrapasse o limite do array
  const end = Math.min(start + pageSize, data.length);

  return data.slice(start, end);
}

// Interface para o resultado da API
interface ApiResult<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
  meta: {
    start: number;
    end: number;
    pageSize: number;
    pageIndex: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Cache para resultados filtrados e ordenados
const dataCache: { [key: string]: any[] } = {};

// Função para simular uma API que retorna dados paginados, filtrados e ordenados
export function mockFetchData(
  endpoint: string,
  filters: Filter[],
  sorting: SortingState[],
  pageIndex: number,
  pageSize: number
): Promise<ApiResult<Product>> {
  // Escolha o conjunto de dados com base no endpoint
  let data: Product[] = [];
  if (endpoint.includes("products")) {
    data = [...mockProducts];
  }

  // Aplicar filtros
  const filteredData = applyFilters(data, filters);

  // Aplicar ordenação
  const sortedData = applySorting(filteredData, sorting);

  // Calcular contagem total
  const totalCount = sortedData.length;

  // Calcular número total de páginas
  const pageCount = Math.ceil(totalCount / pageSize);

  // Verificar se o pageIndex está dentro dos limites válidos
  const validPageIndex = Math.min(pageIndex, pageCount - 1);

  // Aplicar paginação
  const start = validPageIndex * pageSize;
  const end = Math.min(start + pageSize, sortedData.length);
  const paginatedData = sortedData.slice(start, end);

  // Determinar se existem mais páginas
  const hasMore = validPageIndex < pageCount - 1;

  // Simular atraso de rede para ter tempo de ver o indicador de carregamento
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: paginatedData,
        totalCount,
        pageCount,
        meta: {
          start,
          end,
          pageSize,
          pageIndex: validPageIndex,
          hasNextPage: hasMore,
          hasPreviousPage: validPageIndex > 0
        }
      });
    }, 100);
  });
}

// Função para limpar o cache (pode ser chamada após modificações nos dados)
export function clearDataCache() {
  for (const key in dataCache) {
    delete dataCache[key];
  }
}
