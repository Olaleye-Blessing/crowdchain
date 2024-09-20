export interface IFetch<D = unknown> {
  loading: boolean;
  error: null | string;
  data: D;
}
