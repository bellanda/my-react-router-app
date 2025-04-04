import type { ColumnDefinition, TableConfig } from "~/lib/types/data-table";
import { formatDisplayValue } from "~/lib/utils";

/**
 * Interface para configuração rápida de uma tabela
 */
interface ModelTableConfig {
  modelName: string;
  endpoint: string;
  defaultColumns?: string[];
  excludeColumns?: string[];
  initialSort?: { id: string; desc: boolean };
  customColumns?: Record<string, Partial<ColumnDefinition>>;
}

/**
 * Cria uma configuração de tabela para um modelo específico
 */
export function createTableConfig(config: ModelTableConfig): TableConfig {
  const {
    modelName,
    endpoint,
    defaultColumns,
    excludeColumns = [],
    initialSort = { id: "id", desc: false },
    customColumns = {}
  } = config;

  // Mapeamentos padrão para tipos comuns de campos
  const defaultColumnTypes: Record<string, Partial<ColumnDefinition>> = {
    // Campos de ID
    id: {
      header: "ID",
      type: "text",
      sortable: true,
      filterable: true
    },

    // Campos de preço
    price: {
      header: "Preço",
      type: "number",
      sortable: true,
      filterable: true,
      formatFn: (value) => formatDisplayValue(value, "currency")
    },

    // Campos de quantidade
    quantity: {
      header: "Quantidade",
      type: "number",
      sortable: true,
      filterable: true,
      formatFn: (value) => formatDisplayValue(value, "number")
    },

    // Campos booleanos
    is_active: {
      header: "Ativo",
      type: "boolean",
      sortable: true,
      filterable: true,
      formatFn: (value) => formatDisplayValue(value, "boolean")
    },

    // Campos de data
    created_at: {
      header: "Criado em",
      type: "date",
      sortable: true,
      filterable: true,
      formatFn: (value) => formatDisplayValue(value, "datetime")
    },
    updated_at: {
      header: "Atualizado em",
      type: "date",
      sortable: true,
      filterable: true,
      formatFn: (value) => formatDisplayValue(value, "datetime")
    },

    // Campos de usuário
    created_by: {
      header: "Criado por",
      type: "text",
      sortable: true,
      filterable: true
    },
    updated_by: {
      header: "Atualizado por",
      type: "text",
      sortable: true,
      filterable: true
    }
  };

  // Função para gerar uma coluna com base no nome
  const generateColumn = (accessor: string): ColumnDefinition => {
    // Verificar se é uma coluna personalizada
    if (customColumns[accessor]) {
      // Mesclar com configuração padrão para garantir que todos os campos necessários estão presentes
      return {
        accessor,
        header: accessor
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        type: "text",
        sortable: true,
        filterable: true,
        ...customColumns[accessor]
      };
    }

    // Verificar se é uma coluna com mapeamento padrão
    if (defaultColumnTypes[accessor]) {
      return {
        accessor,
        ...defaultColumnTypes[accessor],
        header:
          defaultColumnTypes[accessor].header ||
          accessor
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
      } as ColumnDefinition;
    }

    // Gerar coluna padrão
    return {
      accessor,
      header: accessor
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      type: "text",
      sortable: true,
      filterable: true
    };
  };

  // Gerar colunas
  const columns = (defaultColumns || []).filter((col) => !excludeColumns.includes(col)).map(generateColumn);

  return {
    columns,
    endpoint: {
      url: endpoint,
      sortParam: "ordering",
      pageParam: "offset",
      limitParam: "limit"
    },
    initialSort,
    defaultPageSize: 50
  };
}

/**
 * Cria configuração de tabela para um modelo de produto
 */
export function createProductTableConfig(endpoint: string = "/api/products/"): TableConfig {
  return createTableConfig({
    modelName: "Product",
    endpoint,
    defaultColumns: [
      "id",
      "group__name",
      "category__name",
      "brand__name",
      "model__name",
      "compatible_brand__name",
      "compatible_model__name",
      "color__name",
      "min_stock",
      "max_stock",
      "price",
      "warranty_period",
      "is_active",
      "description",
      "short_description",
      "created_at",
      "updated_at",
      "created_by__email"
    ],
    customColumns: {
      group__name: {
        header: "Grupo",
        type: "text"
      },
      category__name: {
        header: "Categoria",
        type: "text"
      },
      brand__name: {
        header: "Marca",
        type: "text"
      },
      model__name: {
        header: "Modelo",
        type: "text"
      },
      compatible_brand__name: {
        header: "Marca Compatível",
        type: "text"
      },
      compatible_model__name: {
        header: "Modelo Compatível",
        type: "text"
      },
      color__name: {
        header: "Cor",
        type: "text"
      },
      min_stock: {
        header: "Estoque Mín.",
        type: "number",
        formatFn: (value) => formatDisplayValue(value, "number")
      },
      max_stock: {
        header: "Estoque Máx.",
        type: "number",
        formatFn: (value) => formatDisplayValue(value, "number")
      },
      warranty_period: {
        header: "Garantia (dias)",
        type: "number",
        formatFn: (value) => formatDisplayValue(value, "number")
      },
      created_by__email: {
        header: "Criado por",
        type: "text"
      }
    }
  });
}
