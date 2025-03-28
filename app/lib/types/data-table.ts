export type ColumnType = "string" | "number" | "date" | "boolean";

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
  | "remove";

export interface ColumnDefinition {
  accessor: string;
  header: string;
  type: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  formatFn?: (value: any) => any;
}

export interface ApiEndpoint {
  url: string;
  params?: Record<string, any>;
}

export interface TableConfig {
  endpoint: ApiEndpoint;
  columns: ColumnDefinition[];
  initialSort?: SortingState;
  defaultPageSize?: number;
}

export interface Filter {
  id: string;
  operator: FilterOperator;
  value: any;
  _updatedFilters?: Filter[];
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
