import { PagingResponseModel } from 'blg-akaun-ts-lib';

export class DefaultPagingResponseModel<T> implements PagingResponseModel<T> {
  data: T[] = [];
  totalRecords: number = 0;
  offset: number = 0;
  limit: number = 100;
  code: string = 'OK_RESPONSE';
  message: string = null;
}