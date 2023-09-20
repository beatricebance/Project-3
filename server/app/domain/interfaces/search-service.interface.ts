export interface SearchServiceInterface {
  search(query: string): Promise<any>;
}
