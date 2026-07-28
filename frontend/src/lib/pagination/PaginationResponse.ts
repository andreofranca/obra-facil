import { PaginatedResult } from './pagination.types';

export class PaginationResponse<T> implements PaginatedResult<T> {
  public readonly items: T[];
  public readonly total: number;
  public readonly page: number;
  public readonly pageSize: number;
  public readonly totalPages: number;
  public readonly hasNext: boolean;
  public readonly hasPrevious: boolean;

  constructor(items: T[], total: number, page: number, pageSize: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize) || 1;
    this.hasNext = page < this.totalPages;
    this.hasPrevious = page > 1;
  }
}
