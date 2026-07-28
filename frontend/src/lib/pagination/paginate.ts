import { PaginationRequest } from './PaginationRequest';
import { PaginationResponse } from './PaginationResponse';

export interface PrismaDelegate<T> {
  count(args: Record<string, unknown>): Promise<number>;
  findMany(args: Record<string, unknown>): Promise<T[]>;
}

export async function paginate<T>(
  modelDelegate: PrismaDelegate<T>,
  request: PaginationRequest,
  findManyArgs: Record<string, unknown> = {}
): Promise<PaginationResponse<T>> {
  const [total, items] = await Promise.all([
    modelDelegate.count({ where: findManyArgs.where }),
    modelDelegate.findMany({
      ...findManyArgs,
      skip: request.skip,
      take: request.take,
      orderBy: request.sort 
        ? { [request.sort]: request.order }
        : findManyArgs.orderBy,
    }),
  ]);

  return new PaginationResponse<T>(items, total, request.page, request.pageSize);
}
