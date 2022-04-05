import _ from 'lodash';
import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {ApiService} from './api.service';
import {ServiceErrorHandler} from '../service-error.handler';
import {ServiceResponse} from '../service.response';
import {ErrorResponse} from '../error.response';
import {BaseResponse} from '../../../models/core/base-response';
import {stores, StoreType} from '../../../stores';
import {RequestHelper} from '../../../helpers';

// Import this from .env!
const ENV: Record<string, any> = {};

export abstract class ApiServiceImpl implements ApiService {
  private static readonly API_REQUEST_TIMEOUT = 15000;
  private static readonly ENDPOINTS = {
    users: '/rest/users',
  };
  readonly storeType?: StoreType;
  /**
   * Any request that fails is first passed to this error handler before returning it to the caller.
   * Error can be modified or certain actions can be taken if required.
   */
  appErrorHandler: ServiceErrorHandler;

  constructor(storeType: StoreType) {
    this.storeType = storeType;
    this.appErrorHandler = new ServiceErrorHandler();
  }

  // Returns all the REST resources
  protected getEndpoints() {
    return ApiServiceImpl.ENDPOINTS;
  }

  // Returns error object from AxiosResponse
  private static parseError(response: AxiosResponse): string {
    return _.get(response, 'response.data', '');
  }

  // Sets fetching flag in respective store
  private setFetching(flag: boolean = true) {
    if (this.storeType) {
      stores[this.storeType].setFetching(flag);
    }
  }

  // Optional: Sets an error in respective store
  private setError(e?: any) {
    if (this.storeType) {
      stores[this.storeType].setError(
        ApiServiceImpl.parseError(e) || e.toString(),
      );
    }

    if (ENV.isStaging) {
      console.log('API Error: ', e);
    }
  }

  private static queryBuilder(resourceUrl: string): RequestHelper {
    return new RequestHelper(resourceUrl);
  }

  private async getAxiosInstance(customHeaders?: any): Promise<AxiosInstance> {
    const headers: any = {
      Accept: 'application/json',
    };

    const token = stores.userStore.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const instance = axios.create({
      // DEV
      baseURL: ENV.BASE_URL,
      // baseURL: 'https://cors-anywhere.herokuapp.com/http://143.110.248.188/',
      // baseURL: 'http://15.207.51.237/',
      // PRODUCTION
      // baseURL: 'http://ec2-13-126-124-216.ap-south-1.compute.amazonaws.com/',
      timeout: ApiServiceImpl.API_REQUEST_TIMEOUT,
      headers: Object.assign({}, headers, customHeaders),
    });

    instance.interceptors.request.use(request => {
      this.setFetching();
      return request;
    });

    instance.interceptors.response.use(
      (response: AxiosResponse<BaseResponse<any>>) => {
        this.setFetching(false);
        return response;
      },
      (error: AxiosError<BaseResponse<any>>) => {
        this.setFetching(false);
        const errorResponse = new ErrorResponse(error);
        this.setError(errorResponse.getMessage());
        // AlertsHelper.error(errorResponse.getMessage());

        return Promise.reject(this.appErrorHandler.handleError(error));
      },
    );

    return instance;
  }

  protected async get<T = any>(
    url: string,
    queryParams?: Record<string, any>,
    headers?: Object,
  ): Promise<AxiosResponse<T>> {
    const api = await this.getAxiosInstance(headers);
    return api.get(
      queryParams
        ? ApiServiceImpl.queryBuilder(url).addQueries(queryParams)
        : url,
    );
  }

  protected async post<T>(
    url: string,
    data: any,
    headers?: Object,
  ): Promise<AxiosResponse<T>> {
    const api = await this.getAxiosInstance(headers);
    return api.post(url, data);
  }

  protected async put<T>(
    url: string,
    data: any,
    headers?: Object,
  ): Promise<AxiosResponse<T>> {
    const api = await this.getAxiosInstance(headers);
    return api.put(url, data);
  }

  protected async patch<T>(
    url: string,
    data: any,
    headers?: Object,
  ): Promise<AxiosResponse<T>> {
    const api = await this.getAxiosInstance(headers);
    return api.patch(url, data);
  }

  protected async delete<T>(
    url: string,
    headers?: Object,
  ): Promise<AxiosResponse<T>> {
    const api = await this.getAxiosInstance(headers);
    return api.delete(url);
  }

  protected success<T>(data: T): ServiceResponse<T> {
    return new ServiceResponse<T>({data});
  }

  protected error<T>(error: any): ServiceResponse<T> {
    return new ServiceResponse<T>({error: error as AxiosError});
  }
}
