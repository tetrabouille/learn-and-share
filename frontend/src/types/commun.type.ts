export type Filter = {
  field: string;
  value: string | string[] | boolean | number | number[];
  option?: 'contains' | 'in';
  type?: 'string' | 'string[]' | 'number' | 'number[]' | 'boolean';
};

export type Pagination = {
  take: number;
  skip?: number;
  cursor?: {
    field: string;
    value: string;
    type?: 'number' | 'boolean' | 'string';
  };
};

export type Sort = {
  field: string;
  order: 'asc' | 'desc';
};

export type GetAllArgs = {
  filters?: Filter[];
  pagination?: Pagination;
  sortList?: Sort[];
};
