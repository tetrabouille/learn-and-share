/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter, Pagination, Sort } from '../schemas';

const orderBy = (sortList?: Sort[], fields?: string[]): any => {
  const orderBy: any = {};
  sortList?.forEach((sort) => {
    if (fields?.includes(sort.field) && (sort.order === 'asc' || sort.order === 'desc'))
      orderBy[sort.field] = sort.order;
  });
  return orderBy;
};

const getPagination = (pagination?: Pagination): any => {
  const options: any = {};
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

const getFilter = (filter?: any): any => {
  const where: Filter = {};
  if (filter?.lang) where.lang = filter.lang;
  return where;
};

export { orderBy, getPagination, getFilter };
