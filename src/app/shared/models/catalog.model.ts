export interface ICatalog<T> {
  pageIndex: number;
  data: T[];
  pageSize: number;
  count: number;
}