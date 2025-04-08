import type { TableConfig, TableState } from "~/lib/types/data-table";

// Load the previous state of the table from sessionStorage
export default function usePreviousState({
  config,
}: {
  config: TableConfig;
}): TableState | null {
  try {
    // Verify if in the browser before accessing sessionStorage
    if (typeof window === "undefined") return null;

    const storageKey = `data-table-state-${config.endpoint.url}`;
    const savedState = sessionStorage.getItem(storageKey);

    if (savedState) {
      const parsed = JSON.parse(savedState);

      // Ensure the structure of the state is correct
      if (parsed && Array.isArray(parsed.sorting)) {
        // Maintain the consistency of the sorting
        const validSorting = parsed.sorting.filter(
          (sort: any) =>
            sort && typeof sort === "object" && sort.id && "desc" in sort
        );

        return {
          filters: Array.isArray(parsed.filters) ? parsed.filters : [],
          sorting: validSorting,
          pagination: {
            pageIndex: parsed.pagination?.pageIndex ?? 0,
            pageSize:
              parsed.pagination?.pageSize ?? config.defaultPageSize ?? 20,
          },
        };
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return null;
}
