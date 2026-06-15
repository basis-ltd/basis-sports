import { PaginatedResult, PaginationMeta } from '../interfaces/paginated-result.interface';

export function getPaginationParams(page = 1, limit = 50): {
  page: number;
  limit: number;
  skip: number;
  take: number;
} {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(200, Math.max(1, limit));

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };

  return { data, meta };
}