export interface PagedResult<T> {
  results: T[];
  pageCount: number;
  totalCount: number;
};
