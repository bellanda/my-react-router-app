import type { ApiEndpoint, Filter, SortingState } from "../types/data-table";
import { mockFetchData, mockProducts, getUniqueFieldValues } from "../mock-api";
import type { Product } from "../mock-api";

export const fetchTableData = async (
  endpoint: ApiEndpoint,
  filters: Filter[],
  sorting: SortingState[],
  pageIndex: number,
  pageSize: number
) => {
  try {
    // Usar nosso mock de API em vez de fazer chamada real
    return await mockFetchData(endpoint.url, filters, sorting, pageIndex, pageSize);
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};

// Função para buscar valores únicos de uma coluna para exibir no filtro
export const fetchUniqueValues = async (endpoint: ApiEndpoint, columnId: string, searchTerm?: string) => {
  try {
    // Determinar qual conjunto de dados usar com base no endpoint
    let data: Product[] = [];
    if (endpoint.url.includes("products")) {
      data = mockProducts;
    }

    // Buscar valores únicos
    const uniqueValues = getUniqueFieldValues(data, columnId, searchTerm);

    // Formatar resposta
    return uniqueValues.map((item) => ({
      value: item.value,
      label: item.value !== null && item.value !== undefined ? String(item.value) : "(Vazio)",
      count: item.count
    }));
  } catch (error) {
    console.error("Error fetching unique values:", error);
    return [];
  }
};
