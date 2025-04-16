export type ColumnType = "text" | "number" | "date" | "datetime" | "boolean";

export type FilterOperator =
  | "exact"
  | "contains"
  | "startswith"
  | "endswith"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "range"
  | "date"
  | "isnull"
  | "in"
  | "remove"
  | "year"
  | "month"
  | "day"
  | "week";

export interface ColumnDefinition {
  accessor: string;
  header: string;
  type: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  formatFn?: (value: any) => any;
  width?: string;
  displayAccessor?: string;
  renderCell?: (row: any) => React.ReactNode;
  virtual?: boolean;
}

export interface ApiEndpoint {
  url: string;
  sortParam?: string;
  pageParam?: string;
  limitParam?: string;
  params?: Record<string, any>;
}

export interface TableConfig {
  endpoint: ApiEndpoint;
  columns: ColumnDefinition[];
  initialSort?: SortingState;
  defaultPageSize?: number;
  maxHeight?: string;
}

export interface Filter {
  id: string;
  operator: FilterOperator;
  value: any;
  _updatedFilters?: Filter[];
  _fieldType?: ColumnType;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface TableState {
  filters: Filter[];
  sorting: SortingState[];
  pagination: PaginationState;
}

export interface UniqueValueOption {
  value: string | number | boolean | null;
  label: string;
  count: number;
}

export interface VirtualItem {
  index: number;
  key: number | string;
  size: number;
  start: number;
  end: number;
  lane: number;
}

// Interface para o meta dos dados paginados retornados pela API
export interface TableMeta {
  start: number;
  end: number;
  pageSize: number;
  pageIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  next?: string | null;
  previous?: string | null;
}

// Interface para o resultado da API
export interface ApiResult<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
  meta: TableMeta;
}

// Interface para a resposta do Django Rest Framework com CursorPagination
export interface DjangoApiResponse<T> {
  count: number;
  links: {
    next: string | null;
    previous: string | null;
  };
  page_size: number;
  results: T[];
}
