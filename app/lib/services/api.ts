import type { Product } from "~/lib/mock-api";
import { getUniqueFieldValues, mockFetchData, mockProducts } from "~/lib/mock-api";
import type { ApiEndpoint, ApiResult, DjangoApiResponse, Filter, SortingState } from "~/lib/types/data-table";

// URL base da API - pode ser configurada via env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Controle para forçar o uso do mock mesmo se a API estiver configurada
// Pode ser controlado via env ou localmente para desenvolvimento
const FORCE_MOCK_API = import.meta.env.VITE_FORCE_MOCK_API === "true" || false;

// Flag para mostrar logs de debug
const DEBUG_API = import.meta.env.VITE_DEBUG_API === "true" || import.meta.env.DEV || false;

// Credenciais de autenticação
const API_EMAIL = import.meta.env.VITE_API_EMAIL || "";
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD || "";

// Armazenar o token JWT
let JWT_TOKEN: string | null = null;
let JWT_REFRESH_TOKEN: string | null = null;

// Interface para a resposta de autenticação
interface AuthResponse {
  email: string;
  tokens: {
    refresh: string;
    access: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

/**
 * Obter token JWT para autenticação
 * @returns token JWT ou null em caso de erro
 */
export const getJwtToken = async (): Promise<string | null> => {
  // Se já tivermos um token, retorná-lo
  if (JWT_TOKEN) {
    return JWT_TOKEN;
  }

  // Se não tivermos credenciais, não podemos obter um token
  if (!API_EMAIL || !API_PASSWORD) {
    console.warn("Credenciais de API não configuradas. Configure VITE_API_EMAIL e VITE_API_PASSWORD no arquivo .env");
    return null;
  }

  try {
    if (DEBUG_API) console.log("Obtendo token JWT...");

    // Configurações de requisição que funcionam com Django + CORS
    const response = await fetch(`${API_BASE_URL}/api/accounts/login/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: API_EMAIL,
        password: API_PASSWORD
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha na autenticação: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as AuthResponse;

    // Verificar a estrutura da resposta
    if (!data.tokens || !data.tokens.access) {
      if (DEBUG_API) console.log("Resposta de autenticação inválida:", data);
      throw new Error("Formato de resposta de autenticação inválido");
    }

    // Atualizar tokens com base na resposta da API de login
    JWT_TOKEN = data.tokens.access;
    JWT_REFRESH_TOKEN = data.tokens.refresh;

    if (DEBUG_API) console.log("Token JWT obtido com sucesso", data.tokens.user);

    return JWT_TOKEN;
  } catch (error) {
    console.error("Erro ao obter token JWT:", error);
    return null;
  }
};

/**
 * Atualizar token JWT expirado usando refresh token
 * @returns novo token JWT ou null em caso de erro
 */
export const refreshJwtToken = async (): Promise<string | null> => {
  if (!JWT_REFRESH_TOKEN) {
    console.warn("Refresh token não disponível. É necessário autenticar novamente.");
    return await getJwtToken();
  }

  try {
    if (DEBUG_API) console.log("Atualizando token JWT...");

    const response = await fetch(`${API_BASE_URL}/api/accounts/token/refresh/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refresh: JWT_REFRESH_TOKEN
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha na atualização do token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    JWT_TOKEN = data.access;

    if (DEBUG_API) console.log("Token JWT atualizado com sucesso");

    return JWT_TOKEN;
  } catch (error) {
    console.error("Erro ao atualizar token JWT:", error);
    JWT_TOKEN = null;
    JWT_REFRESH_TOKEN = null;
    return await getJwtToken();
  }
};

// Função para converter filtros para o formato esperado pelo DRF
export const convertFiltersToDjangoQuery = (filters: Filter[]): Record<string, string> => {
  const queryParams: Record<string, string> = {};

  filters.forEach((filter) => {
    const { id, operator, value } = filter;

    // Pular filtros sem valor ou operador remove
    if (value === undefined || value === null || operator === "remove") {
      return;
    }

    // Montar o parâmetro de filtro conforme o padrão Django: field__operator=value
    const paramName = operator === "exact" ? id : `${id}__${operator}`;

    // Tratar diferentes tipos de valores
    if (operator === "range" && Array.isArray(value)) {
      queryParams[paramName] = `${value[0]},${value[1]}`;
    } else if (operator === "isnull") {
      queryParams[paramName] = value ? "True" : "False";
    } else {
      queryParams[paramName] = String(value);
    }
  });

  return queryParams;
};

// Função para construir a string de ordenação para o Django
export const buildOrderingString = (sorting: SortingState[]): string => {
  if (!sorting || sorting.length === 0) return "";

  return sorting.map((sort) => `${sort.desc ? "-" : ""}${sort.id}`).join(",");
};

/**
 * Executa uma requisição autenticada
 * @param url URL da requisição
 * @param options Opções da requisição fetch
 * @returns Resposta da requisição
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Se estamos forçando o uso do mock, não precisamos autenticar
  if (FORCE_MOCK_API) {
    return fetch(url, options);
  }

  try {
    // Configuração padrão que funciona com a maioria dos backends Django
    const defaultOptions: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      ...options
    };

    // Garantir o token JWT
    let token = await getJwtToken();

    if (token) {
      // Adicionar o token de autenticação
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `Bearer ${token}`
      };
    } else if (DEBUG_API) {
      console.warn("Fazendo requisição sem token de autenticação:", url);
    }

    // Tentar fazer a requisição com o token atual
    const response = await fetch(url, defaultOptions);

    // Se receber 401 Unauthorized, tentar atualizar o token e repetir a requisição
    if (response.status === 401) {
      if (DEBUG_API) console.log("Token expirado ou inválido, tentando atualizar...");
      token = await refreshJwtToken();

      if (token) {
        if (DEBUG_API) console.log("Token atualizado, repetindo requisição");
        const updatedOptions = {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            Authorization: `Bearer ${token}`
          }
        };
        return fetch(url, updatedOptions);
      } else {
        if (DEBUG_API) console.log("Não foi possível atualizar o token, a requisição provavelmente falhará");
      }
    }

    return response;
  } catch (error) {
    console.error("Erro na requisição autenticada:", error);
    throw error;
  }
};

/**
 * Verifica se o usuário está autenticado
 * @returns Promise que resolve para true se autenticado, false caso contrário
 */
export const isAuthenticated = async (): Promise<boolean> => {
  if (FORCE_MOCK_API) {
    // No modo mock, consideramos sempre autenticado
    return true;
  }

  try {
    // Tentar obter informações do usuário atual
    const token = await getJwtToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (DEBUG_API && !response.ok) {
      const errorText = await response.text();
      console.error(`Verificação de autenticação falhou: ${response.status} - ${errorText}`);
    }

    return response.ok;
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return false;
  }
};

// Função para buscar dados da tabela, tentando usar a API real ou fallback para mock
export const fetchTableData = async (
  endpoint: ApiEndpoint,
  filters: Filter[],
  sorting: SortingState[],
  pageIndex: number,
  pageSize: number
): Promise<ApiResult<any>> => {
  try {
    // Se estamos forçando o uso do mock, pular a chamada real
    if (FORCE_MOCK_API) {
      if (DEBUG_API) console.log("Usando mock API (forçado por configuração)");
      return await mockFetchData(endpoint.url, filters, sorting, pageIndex, pageSize);
    }

    // Primeiro garantir que temos o token de autenticação
    const token = await getJwtToken();
    if (!token && !endpoint.url.includes("login")) {
      if (DEBUG_API) console.log("Não foi possível obter token JWT, usando mock data");
      return await mockFetchData(endpoint.url, filters, sorting, pageIndex, pageSize);
    }

    // Construir URL base - usando a URL base definida ou a relativa
    const baseUrl = endpoint.url.startsWith("http") ? endpoint.url : `${API_BASE_URL}${endpoint.url}`;

    // Construir query params
    const queryParams = new URLSearchParams();

    // Adicionar parâmetros de ordenação
    const orderingString = buildOrderingString(sorting);
    if (orderingString) {
      queryParams.set(endpoint.sortParam || "ordering", orderingString);
    }

    // Adicionar parâmetros de paginação para cursor pagination
    // Se página > 0, deve ter vindo de uma resposta anterior e terá uma URL completa
    // para next ou previous, mas se for a primeira página, montamos do zero
    if (pageIndex === 0) {
      // Para a primeira página, não enviamos o cursor
      queryParams.set(endpoint.limitParam || "limit", String(pageSize));
    }

    // Adicionar parâmetros de filtros
    const filterParams = convertFiltersToDjangoQuery(filters);
    Object.entries(filterParams).forEach(([key, value]) => {
      queryParams.set(key, value);
    });

    // Adicionar outros parâmetros da configuração, se existirem
    if (endpoint.params) {
      Object.entries(endpoint.params).forEach(([key, value]) => {
        queryParams.set(key, String(value));
      });
    }

    // Construir URL final
    const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${queryParams.toString()}`;

    if (DEBUG_API) console.log(`Tentando buscar dados de: ${url} (com token: ${!!token})`);

    try {
      // Tentar fazer a requisição autenticada
      const response = await authenticatedFetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const djangoResponse = (await response.json()) as DjangoApiResponse<any>;

      if (DEBUG_API) console.log("Resposta da API:", djangoResponse);

      // Formatar a resposta para o formato esperado pelo componente
      return {
        data: djangoResponse.results || djangoResponse,
        totalCount: djangoResponse.count || (Array.isArray(djangoResponse) ? djangoResponse.length : 0),
        pageCount: Math.ceil((djangoResponse.count || (Array.isArray(djangoResponse) ? djangoResponse.length : 0)) / pageSize),
        meta: {
          start: pageIndex * pageSize,
          end:
            pageIndex * pageSize + (djangoResponse.results?.length || (Array.isArray(djangoResponse) ? djangoResponse.length : 0)),
          pageSize,
          pageIndex,
          hasNextPage: !!djangoResponse.next,
          hasPreviousPage: !!djangoResponse.previous,
          next: djangoResponse.next,
          previous: djangoResponse.previous
        }
      };
    } catch (error) {
      console.warn("Error fetching from real API, falling back to mock data:", error);

      // Se a requisição real falhar, usar o mock
      return await mockFetchData(endpoint.url, filters, sorting, pageIndex, pageSize);
    }
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};

// Função para buscar valores únicos de uma coluna para exibir no filtro
export const fetchUniqueValues = async (endpoint: ApiEndpoint, columnId: string, searchTerm?: string) => {
  try {
    // Se estamos forçando o uso do mock, pular a chamada real
    if (FORCE_MOCK_API) {
      if (DEBUG_API) console.log("Usando mock API para valores únicos (forçado por configuração)");

      // Usar o mock
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
    }

    // Tentar usar a API real primeiro
    const baseUrl = endpoint.url.startsWith("http") ? endpoint.url : `${API_BASE_URL}${endpoint.url}`;

    const url = `${baseUrl}unique/?column=${columnId}&range=0-100`;

    if (DEBUG_API) console.log(`Tentando buscar valores únicos de: ${url}`);

    try {
      // Usar requisição autenticada para valores únicos
      const response = await authenticatedFetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (DEBUG_API) console.log("Valores únicos da API:", data);

      // Formatar a resposta
      return data.map((value: any) => ({
        value,
        label: value !== null && value !== undefined ? String(value) : "(Vazio)",
        count: 1 // A API não retorna contagem, então usamos 1 como padrão
      }));
    } catch (error) {
      console.warn("Error fetching unique values from real API, falling back to mock data:", error);

      // Se a requisição real falhar, usar o mock
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
    }
  } catch (error) {
    console.error("Error fetching unique values:", error);
    return [];
  }
};
