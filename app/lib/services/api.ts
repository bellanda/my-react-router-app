import type {
  ApiEndpoint,
  ApiResult,
  DjangoApiResponse,
  Filter,
  SortingState,
} from "~/lib/types/data-table";

// URL base da API - pode ser configurada via env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Flag para mostrar logs de debug
const DEBUG_API_RAW = import.meta.env.VITE_DEBUG_API;
const DEBUG_API = DEBUG_API_RAW === "true" || import.meta.env.DEV || false;

// Credenciais de autenticação
const API_EMAIL = import.meta.env.VITE_API_EMAIL || "";
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD || "";

// Verificação de inicialização para depuração
console.log("=== API Config Debug ===");
console.log("API_BASE_URL:", API_BASE_URL);
console.log("DEBUG_API (raw):", DEBUG_API_RAW, "=>", DEBUG_API);
console.log("API_EMAIL configured:", !!API_EMAIL);
console.log("API_PASSWORD configured:", !!API_PASSWORD);
console.log("======================");

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
    console.log("Usando token JWT existente");
    return JWT_TOKEN;
  }

  // Se não tivermos credenciais, não podemos obter um token
  if (!API_EMAIL || !API_PASSWORD) {
    console.warn(
      "Credenciais de API não configuradas. Configure VITE_API_EMAIL e VITE_API_PASSWORD no arquivo .env"
    );
    return null;
  }

  try {
    console.log("Tentando obter token JWT com credenciais:", API_EMAIL);
    console.log("URL base da API:", API_BASE_URL);

    // Verificar se a URL base da API está configurada
    if (!API_BASE_URL) {
      console.error(
        "URL base da API não configurada. Configure VITE_API_BASE_URL no arquivo .env"
      );
      return null;
    }

    // URL do endpoint de login
    const loginUrl = `${API_BASE_URL}/api/accounts/login/`;
    console.log("URL de login:", loginUrl);

    // Configurações de requisição que funcionam com Django + CORS
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: API_EMAIL,
        password: API_PASSWORD,
      }),
    });

    console.log("Resposta do login:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Falha na autenticação: ${response.status} - ${errorText}`);
      throw new Error(
        `Falha na autenticação: ${response.status} - ${errorText}`
      );
    }

    const data = (await response.json()) as AuthResponse;
    console.log("Resposta de autenticação:", data);

    // Verificar a estrutura da resposta
    if (!data.tokens || !data.tokens.access) {
      console.error("Resposta de autenticação inválida:", data);
      throw new Error("Formato de resposta de autenticação inválido");
    }

    // Atualizar tokens com base na resposta da API de login
    JWT_TOKEN = data.tokens.access;
    JWT_REFRESH_TOKEN = data.tokens.refresh;

    console.log("Token JWT obtido com sucesso");
    console.log("Usuário autenticado:", data.email);

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
    console.warn(
      "Refresh token não disponível. É necessário autenticar novamente."
    );
    return await getJwtToken();
  }

  try {
    if (DEBUG_API) console.log("Atualizando token JWT...");

    const response = await fetch(
      `${API_BASE_URL}/api/accounts/token/refresh/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: JWT_REFRESH_TOKEN,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Falha na atualização do token: ${response.status} - ${errorText}`
      );
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
export const convertFiltersToDjangoQuery = (
  filters: Filter[]
): Record<string, string> => {
  const queryParams: Record<string, string> = {};

  // Agrupar filtros pelo ID para processar valores múltiplos como __in
  const filterGroups: Record<string, Filter[]> = {};

  // Agrupar filtros por ID
  filters.forEach((filter) => {
    if (
      filter.operator !== "remove" &&
      filter.value !== undefined &&
      filter.value !== null
    ) {
      if (!filterGroups[filter.id]) {
        filterGroups[filter.id] = [];
      }
      filterGroups[filter.id].push(filter);
    }
  });

  // Processar cada grupo de filtros
  Object.entries(filterGroups).forEach(([id, filtersForId]) => {
    // Verificar se estamos lidando com operadores de comparação (gt, lt, etc.)
    const hasComparisonOperators = filtersForId.some((f) =>
      ["gt", "lt", "gte", "lte"].includes(f.operator)
    );

    // Se temos múltiplos valores com MESMO operador e não são comparação ou range, usar __in
    if (
      filtersForId.length > 1 &&
      !hasComparisonOperators &&
      !filtersForId.some((f) => f.operator === "range") &&
      new Set(filtersForId.map((f) => f.operator)).size === 1 // todos operadores são iguais
    ) {
      // Verificar se estamos lidando com um campo de data pelo formato do valor
      const isDateField = filtersForId.some(
        (f) =>
          typeof f.value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f.value)
      );

      // Construir o parâmetro com __in ou __date__in para datas
      const paramName = isDateField ? `${id}__date__in` : `${id}__in`;

      // Juntar todos os valores como uma string separada por vírgulas
      queryParams[paramName] = filtersForId
        .map((f) => String(f.value))
        .join(",");
    } else {
      // Caso contrário, processar cada filtro individualmente
      filtersForId.forEach((filter) => {
        const { id, operator, value } = filter;

        // Montar o parâmetro de filtro conforme o padrão Django
        let paramName;

        // Verificar se é um valor de data pelo formato
        const isDateValue =
          (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) ||
          (Array.isArray(value) &&
            value.every(
              (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)
            ));

        if (isDateValue) {
          // Tratamento específico para filtros de data
          if (operator === "range") {
            paramName = `${id}__date__range`;
          } else if (operator === "date") {
            paramName = `${id}__date`;
          } else if (operator === "exact") {
            paramName = `${id}__date`;
          } else {
            // Para outros operadores (gt, lt, etc.) adicionar __date ao id
            paramName = `${id}__date__${operator}`;
          }
        } else {
          // Para valores não-data, usar formatação padrão
          paramName = operator === "exact" ? id : `${id}__${operator}`;
        }

        // Tratar diferentes tipos de valores
        if (operator === "range" && Array.isArray(value)) {
          queryParams[paramName] = `${value[0]},${value[1]}`;
        } else if (operator === "isnull") {
          queryParams[paramName] = value ? "True" : "False";
        } else {
          queryParams[paramName] = String(value);
        }
      });
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
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    console.log("Iniciando authenticatedFetch para URL:", url);

    // Verificar se a URL é completa (com protocolo e domínio)
    const isFullUrl = url.startsWith("http://") || url.startsWith("https://");

    // Se for URL completa, vamos usá-la diretamente para evitar problemas de CORS
    // Isso é importante ao usar nextUrl e previousUrl fornecidos pela API
    let requestUrl = url;

    if (!isFullUrl) {
      // Para URLs relativas, verificamos se começa com /
      if (!url.startsWith("/")) {
        requestUrl = `/${url}`;
        console.log("Adicionando / à URL relativa:", requestUrl);
      }

      // Adicionar a URL base da API para URLs relativas
      if (API_BASE_URL) {
        const baseUrl = API_BASE_URL.endsWith("/")
          ? API_BASE_URL.slice(0, -1)
          : API_BASE_URL;
        requestUrl = `${baseUrl}${requestUrl}`;
        console.log("URL com base adicionada:", requestUrl);
      }
    } else {
      console.log("Usando URL completa diretamente:", requestUrl);
    }

    // Configuração padrão que funciona com a maioria dos backends Django
    const defaultOptions: RequestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors", // Explicitamente definir o modo CORS
      credentials: "include", // Incluir cookies se necessário
      ...options,
    };

    // Garantir o token JWT
    let token = await getJwtToken();

    if (token) {
      // Adicionar o token de autenticação
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `Bearer ${token}`,
      };
      console.log("Token adicionado aos headers");
    } else {
      console.warn("Fazendo requisição sem token de autenticação:", requestUrl);
    }

    // Tentar fazer a requisição com o token atual
    console.log("Executando fetch para:", requestUrl);
    const response = await fetch(requestUrl, defaultOptions);
    console.log("Resposta recebida:", response.status, response.statusText);

    // Verificar o tipo de conteúdo da resposta
    const contentType = response.headers.get("content-type");
    console.log("Tipo de conteúdo da resposta:", contentType);

    // Se não for JSON, provavelmente é um erro ou redirecionamento
    if (contentType && !contentType.includes("application/json")) {
      // Em caso de erro, clonar a resposta para poder ler o corpo duas vezes
      const clonedResponse = response.clone();
      const responseText = await clonedResponse.text();
      console.error(
        "Resposta não-JSON recebida:",
        responseText.substring(0, 500) + "..."
      );
    }

    // Se receber 401 Unauthorized, tentar atualizar o token e repetir a requisição
    if (response.status === 401) {
      console.log("Token expirado ou inválido, tentando atualizar...");
      token = await refreshJwtToken();

      if (token) {
        console.log("Token atualizado, repetindo requisição");
        const updatedOptions = {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            Authorization: `Bearer ${token}`,
          },
        };
        return fetch(requestUrl, updatedOptions);
      } else {
        console.log(
          "Não foi possível atualizar o token, a requisição provavelmente falhará"
        );
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
  try {
    // Tentar obter informações do usuário atual
    const token = await getJwtToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (DEBUG_API && !response.ok) {
      const errorText = await response.text();
      console.error(
        `Verificação de autenticação falhou: ${response.status} - ${errorText}`
      );
    }

    return response.ok;
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return false;
  }
};

// Função para buscar dados da tabela
export const fetchTableData = async (
  endpoint: ApiEndpoint,
  filters: Filter[],
  sorting: SortingState[],
  pageIndex: number,
  pageSize: number
): Promise<ApiResult<any>> => {
  try {
    // Logs detalhados para depuração
    console.log("==== FETCH TABLE DATA ====");
    console.log("URL endpoint:", endpoint.url);
    console.log("API_BASE_URL:", API_BASE_URL);

    // Verificar se a URL base da API está configurada
    if (!API_BASE_URL) {
      throw new Error(
        "URL base da API não está configurada. Configure VITE_API_BASE_URL no arquivo .env"
      );
    }

    // Tentar obter o token de autenticação
    let token;
    try {
      token = await getJwtToken();
      console.log("Token obtido:", token ? "Sim" : "Não");
    } catch (authError) {
      console.error("Erro ao obter token:", authError);
      throw new Error(
        "Falha na autenticação: Não foi possível obter token JWT"
      );
    }

    // Se não conseguimos obter o token e não é endpoint de login, lançar erro
    if (!token && !endpoint.url.includes("login")) {
      console.error("Não foi possível obter token JWT.");
      throw new Error("Falha na autenticação: Token JWT não disponível");
    }

    // Construir URL base - usando a URL base definida ou a relativa
    let baseUrl = endpoint.url.startsWith("http")
      ? endpoint.url
      : `${API_BASE_URL}${endpoint.url}`;

    // Garantir que a URL não tem barras duplicadas
    if (!baseUrl.startsWith("http")) {
      // Remover barras extras
      if (baseUrl.startsWith("//")) {
        baseUrl = baseUrl.substring(1);
      }
      // Garantir que a URL começa com /
      if (!baseUrl.startsWith("/")) {
        baseUrl = "/" + baseUrl;
      }
    }

    console.log("URL base construída:", baseUrl);

    // Construir query params
    const queryParams = new URLSearchParams();

    // Adicionar parâmetros de ordenação
    const orderingString = buildOrderingString(sorting);
    if (orderingString) {
      queryParams.set(endpoint.sortParam || "ordering", orderingString);
    }

    // Adicionar parâmetros de paginação para PageNumberPagination
    if (pageIndex > 0) {
      queryParams.set("page", String(pageIndex + 1)); // Converte pageIndex para page number (1-indexed)
    }
    queryParams.set("page_size", String(pageSize));

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
    console.log("URL final para requisição:", url);

    // Tentar fazer a requisição autenticada
    console.log("Iniciando requisição autenticada...");
    const response = await authenticatedFetch(url);
    console.log(
      "Resposta da requisição:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      console.error(
        `Erro HTTP na requisição: ${response.status} - ${response.statusText}`
      );

      // Verificar o tipo de conteúdo da resposta
      const contentType = response.headers.get("content-type");
      console.log("Tipo de conteúdo da resposta de erro:", contentType);

      if (contentType && contentType.includes("application/json")) {
        // Resposta JSON de erro
        const errorJson = await response.json();
        console.error("Detalhes do erro (JSON):", errorJson);
        throw new Error(
          `HTTP error! status: ${response.status} - ${JSON.stringify(errorJson)}`
        );
      } else {
        // Resposta HTML ou texto de erro
        const errorText = await response.text();
        console.error(
          "Detalhes do erro (texto):",
          errorText.substring(0, 500) + "..."
        );
        throw new Error(
          `HTTP error! status: ${response.status} - Resposta não-JSON recebida`
        );
      }
    }

    // Verificar o tipo de conteúdo
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error(
        "Resposta não é JSON:",
        textResponse.substring(0, 500) + "..."
      );
      throw new Error("Resposta da API não está no formato JSON esperado");
    }

    console.log("Requisição bem-sucedida, processando resposta JSON...");

    let djangoResponse;
    try {
      djangoResponse = (await response.json()) as DjangoApiResponse<any>;
    } catch (jsonError) {
      console.error("Erro ao processar JSON da resposta:", jsonError);
      // Tentar ler o texto da resposta para diagnóstico
      const textResponse = await response.clone().text();
      console.error(
        "Conteúdo da resposta:",
        textResponse.substring(0, 500) + "..."
      );
      throw new Error("Falha ao processar resposta JSON: " + String(jsonError));
    }

    console.log("Dados recebidos:", djangoResponse.count, "resultados");

    if (!djangoResponse.results) {
      console.error(
        "Resposta não possui o formato esperado (results):",
        djangoResponse
      );
      throw new Error("Formato de resposta inválido");
    }

    // Processa os resultados para acomodar os campos aninhados
    // Se um campo acessor contiver __ e o valor não estiver presente diretamente,
    // mas existir em additional_info, usamos o valor do additional_info
    const processedResults =
      djangoResponse.results?.map((item) => {
        const result = { ...item };

        // Para cada item no resultado, vamos verificar se há acessores com __ que precisam
        // ser populados a partir de additional_info
        if (item.additional_info) {
          // Obtém as chaves do additional_info
          const additionalInfoKeys = Object.keys(item.additional_info);

          // Primeiramente, copiar todos os campos de additional_info para o result
          // para garantir que possam ser acessados pela notação de ponto
          // Isso garante que campos como additional_info.group funcionem
          result.additional_info = { ...item.additional_info };

          // Agora, criar acessores com __ para facilitar o acesso nas colunas
          // Exemplo: criar um campo group__name com o valor de additional_info.group
          additionalInfoKeys.forEach((infoKey) => {
            // Formar o acessor com underscores duplos (group__name, etc.)
            const accessorName = `${infoKey}__name`;

            // Definir o valor para cada campo do additional_info
            if (!result[accessorName]) {
              result[accessorName] = item.additional_info[infoKey];
            }

            // Também adicionar como acessor direto se não existir
            // Exemplo: group = additional_info.group
            if (!result[infoKey] && infoKey !== "stock_details") {
              result[infoKey] = item.additional_info[infoKey];
            }
          });

          // Também verificar se há campos no objeto original com formato __name
          // que devem ser preenchidos a partir do additional_info
          Object.keys(result).forEach((key) => {
            if (key.includes("__")) {
              // Extrai o nome do campo após o __
              const [prefix, field] = key.split("__");

              // Se esse campo corresponde a uma chave em additional_info
              if (additionalInfoKeys.includes(prefix)) {
                // Define o valor usando o acessor
                result[key] = item.additional_info[prefix];
              }
            }
          });
        }

        return result;
      }) || [];

    console.log(
      `Processamento concluído: ${processedResults.length} resultados`
    );

    // Formatar a resposta para o formato esperado pelo componente
    return {
      data: processedResults,
      totalCount:
        djangoResponse.count ||
        (Array.isArray(djangoResponse) ? djangoResponse.length : 0),
      pageCount: Math.ceil(
        (djangoResponse.count ||
          (Array.isArray(djangoResponse) ? djangoResponse.length : 0)) /
          pageSize
      ),
      meta: {
        start: pageIndex * pageSize,
        end:
          pageIndex * pageSize +
          (djangoResponse.results?.length ||
            (Array.isArray(djangoResponse) ? djangoResponse.length : 0)),
        pageSize: djangoResponse.page_size || pageSize,
        pageIndex,
        hasNextPage: !!djangoResponse.links.next,
        hasPreviousPage: !!djangoResponse.links.previous,
        // URLs completas para paginação
        next: djangoResponse.links.next,
        previous: djangoResponse.links.previous,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

// Função para buscar valores únicos de uma coluna para exibir no filtro
export const fetchUniqueValues = async (
  endpoint: ApiEndpoint,
  columnId: string,
  searchTerm?: string
) => {
  try {
    // Se a URL base da API não está configurada ou está vazia, lançar erro
    if (!API_BASE_URL) {
      throw new Error(
        "URL base da API não está configurada. Configure VITE_API_BASE_URL no arquivo .env"
      );
    }

    // Verificar se temos token válido
    const token = await getJwtToken();
    if (!token) {
      throw new Error("Falha na autenticação: Token JWT não disponível");
    }

    // Tentar usar a API real
    const baseUrl = endpoint.url.startsWith("http")
      ? endpoint.url
      : `${API_BASE_URL}${endpoint.url}`;

    // Construir URL com parâmetros
    let url = `${baseUrl}unique/?column=${columnId}&range=0-100`;

    // Adicionar parâmetro de pesquisa se fornecido
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    if (DEBUG_API) console.log(`Tentando buscar valores únicos de: ${url}`);

    // Usar requisição autenticada para valores únicos
    const response = await authenticatedFetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (DEBUG_API) console.log("Valores únicos da API:", data);

    // Determinar se estamos lidando com uma coluna de data pelo formato dos valores
    const isDateColumn =
      Array.isArray(data) &&
      data.length > 0 &&
      typeof data[0] === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(data[0]);

    // Verificar se estamos lidando com valores booleanos
    const isBooleanColumn =
      Array.isArray(data) &&
      data.length > 0 &&
      (data.every((v) => v === true || v === false) ||
        data.every((v) => v === "true" || v === "false"));

    // Formatar a resposta
    return data.map((value: any) => {
      if (value === null || value === undefined) {
        return {
          value,
          label: "(Vazio)",
          count: 1,
        };
      }

      // Se for uma coluna de data, formatar o label adequadamente
      if (
        isDateColumn &&
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}/.test(value)
      ) {
        const dateObj = new Date(value);
        return {
          value, // Manter o valor original para o filtro
          label: dateObj.toLocaleDateString("pt-BR"), // Formatar como DD/MM/YYYY
          count: 1,
        };
      }

      // Formatar valores booleanos como "Sim" e "Não"
      if (isBooleanColumn) {
        const boolValue =
          typeof value === "string" ? value === "true" : Boolean(value);
        return {
          value, // Manter o valor original para o filtro
          label: boolValue ? "Sim" : "Não",
          count: 1,
        };
      }

      return {
        value,
        label: String(value),
        count: 1, // A API não retorna contagem, então usamos 1 como padrão
      };
    });
  } catch (error) {
    console.error("Erro ao buscar valores únicos:", error);
    throw error; // Propagar o erro para ser tratado pelo componente
  }
};

/**
 * Busca a contagem total de registros para um endpoint específico
 * @param baseEndpoint URL base do endpoint (ex: /api/products/)
 * @returns Número total de registros ou null em caso de erro
 */
export const fetchTotalRowCount = async (
  baseEndpoint: string
): Promise<number | null> => {
  try {
    // Se a URL base da API não está configurada ou está vazia, lançar erro
    if (!API_BASE_URL) {
      throw new Error(
        "URL base da API não está configurada. Configure VITE_API_BASE_URL no arquivo .env"
      );
    }

    // Verificar se temos token válido
    const token = await getJwtToken();
    if (!token) {
      throw new Error("Falha na autenticação: Token JWT não disponível");
    }

    // Remover barra final se existir, para adicionar o path correto
    const cleanEndpoint = baseEndpoint.endsWith("/")
      ? baseEndpoint.slice(0, -1)
      : baseEndpoint;

    // Construir a URL para a contagem total
    const countUrl = `${API_BASE_URL}${cleanEndpoint}/count_total_rows/?format=json`;
    console.log("Buscando contagem total em:", countUrl);

    // Fazer a requisição autenticada
    const response = await authenticatedFetch(countUrl);

    if (!response.ok) {
      console.error(
        `Erro ao buscar contagem total: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    console.log("Contagem total recebida:", data);

    if (data && typeof data.total_rows === "number") {
      return data.total_rows;
    } else {
      console.error("Formato de resposta inválido para contagem total:", data);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar contagem total:", error);
    return null;
  }
};
