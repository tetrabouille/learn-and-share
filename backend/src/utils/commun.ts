/* eslint-disable @typescript-eslint/no-explicit-any */
import { set } from 'lodash';
import { Filter, Pagination, Sort } from '../schemas';

const orderBy = (sortList?: Sort[], fields?: string[]): any => {
  if (!sortList || !fields) return {};
  const orderBy = sortList
    ?.map((sort) => {
      if (fields?.includes(sort.field) && (sort.order === 'asc' || sort.order === 'desc'))
        return set({}, sort.field, sort.order);
    })
    .filter((x) => x);
  return orderBy;
};

const getPagination = (pagination?: Pagination) => {
  const options: {
    take?: number;
    skip?: number;
    cursor?: any;
  } = {};
  if (pagination?.take) options.take = pagination.take;
  if (pagination?.skip) options.skip = pagination.skip;
  if (pagination?.cursor?.field) {
    options.skip = 1;
    const value = (() => {
      switch (pagination.cursor.type) {
        case 'number':
          return Number(pagination.cursor.value);
        case 'boolean':
          return pagination.cursor.value === 'true';
        case 'string':
        default:
          return pagination.cursor.value;
      }
    })();
    options.cursor = {
      [pagination.cursor.field]: value,
    };
  }
  return options;
};

const getFilters = (filters?: Filter[]): any => {
  const where: any = {};
  if (!filters?.length) return where;

  filters.forEach((filter) => {
    const value = (() => {
      switch (filter.type) {
        default:
        case 'string':
          return filter.value;
        case 'string[]':
          return (filter.value as string).split(';');
        case 'number':
          return Number(filter.value);
        case 'number[]':
          return (filter.value as string).split(';').map(Number);
        case 'boolean':
          return filter.value === 'true';
      }
    })();
    if (filter.option) {
      set(where, filter.field, { [filter.option]: value });
    } else {
      set(where, filter.field, value);
    }
  });

  return where;
};

const getFindManyParams = (
  filters?: Filter[],
  pagination?: Pagination,
  sortList?: Sort[],
  sortFields?: string[]
) => ({
  orderBy: orderBy(sortList, sortFields),
  where: getFilters(filters),
  ...getPagination(pagination),
});

export { orderBy, getPagination, getFilters, getFindManyParams };
