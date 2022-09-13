import { Http, HttpOptions } from '@capacitor-community/http';

const PROXY_URL = 'http://localhost:3005/';
export const appendProxy = (path: string) => PROXY_URL + path;

const MONEY_BRILLIANT_HOST_URL = 'https://api.moneybrilliant.com.au/api/v1/';
export const appendMoneyBrilliant = (path: string) =>
  MONEY_BRILLIANT_HOST_URL + path;

export class MoneyBrilliantApi {
  private _web: boolean;
  private _authHeaders: any;

  constructor(web: boolean) {
    this._web = web;
  }

  private _call(
    path: string,
    method: string,
    options: Omit<HttpOptions, 'url' | 'method'>
  ) {
    let reqConfig: HttpOptions;
    if (options.headers) {
      Object.assign(options.headers, this._authHeaders);
    } else {
      options.headers = this._authHeaders;
    }
    if (this._web) {
      reqConfig = {
        url: appendProxy(`money-brilliant-proxy`),
        method: 'POST',
        data: {
          path,
          method,
          ...options,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } else {
      reqConfig = {
        url: appendMoneyBrilliant(path),
        method,
        ...options,
      };
    }
    return Http.request(reqConfig);
  }

  public setAuthHeaders(headers: any) {
    this._authHeaders = headers;
  }

  public get(path: string, opts?: Omit<HttpOptions, 'url' | 'method'>) {
    return this._call(path, 'GET', opts || {});
  }

  public post(path, opts: Omit<HttpOptions, 'url' | 'method'>) {
    return this._call(path, 'POST', opts);
  }

  public token(username: string, password: string) {
    return Http.get({
      url: appendProxy('token'),
      method: 'GET',
      params: {
        username,
        password,
      },
    }).then((res) => res?.data?.token);
  }
}
