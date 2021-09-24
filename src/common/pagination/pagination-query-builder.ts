import { getOrder } from './order-options-builder';
import { PaginationParams } from './pagination-params';

export const buildPaginationQuery = (params: PaginationParams) => {
  const paginationOptions = {
    page: params.page ? parseInt(params.page.toString()) : 1,
    limit: params.limit ? parseInt(params.limit.toString()) : 1,
  };
  const orderOptions = getOrder(params.order ? params.order : 'id:asc');
  return {
    paginationOptions,
    orderOptions,
  };
};
