import { PaginationParams } from './pagination.types';

export class PaginationRequest {
  public readonly page: number;
  public readonly pageSize: number;
  public readonly sort?: string;
  public readonly order?: 'asc' | 'desc';

  constructor(params: PaginationParams = {}) {
    this.page = Math.max(1, params.page || 1);
    this.pageSize = Math.min(100, Math.max(1, params.pageSize || 10)); // Max 100 per page
    this.sort = params.sort;
    this.order = params.order === 'desc' ? 'desc' : 'asc';
  }

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }

  get take(): number {
    return this.pageSize;
  }

  static fromSearchParams(searchParams: URLSearchParams): PaginationRequest {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const sort = searchParams.get('sort') || undefined;
    const order = searchParams.get('order') === 'desc' ? 'desc' : 'asc';
    
    return new PaginationRequest({ page, pageSize, sort, order });
  }
}
