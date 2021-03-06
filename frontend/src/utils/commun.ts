import queryString from 'query-string';

import type { Pagination, GetAllArgs } from '@/types/commun.type';

const isInViewport = (element: any, { top = 0, left = 0, bottom = 0, right = 0 }) => {
  if (!element) return;
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= top &&
    rect.left >= left &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - bottom &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) - right
  );
};

const getUrlWithParams = (url: string, params: any) => {
  const query = queryString.stringify(params);
  return `${url}?${query}`;
};

const getParamsFromLocation = () => {
  const { search } = window.location;
  return queryString.parse(search);
};

const getUrlFromParams = (pathname: string, params: any) => {
  const query = queryString.stringify(params);
  return query ? `${pathname}?${query}` : pathname;
};

const getPaginationQueryVar = ({ take, cursor, skip }: Pagination): GetAllArgs => {
  return {
    pagination: { take, cursor, skip },
    sortList: [{ field: 'createdAt', order: 'desc' }],
  };
};

export { isInViewport, getUrlWithParams, getParamsFromLocation, getUrlFromParams, getPaginationQueryVar };
