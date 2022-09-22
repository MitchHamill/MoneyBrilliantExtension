import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserCredentials, UserIncome } from 'src/app/types';
import Cache from './cache';

export enum StorageKeys {
  authToken = 'auth_token',
  transactions = 'transactions',
  overview = 'overview',
  income = 'user_income',
  creds = 'user_credentials',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public cache: Cache;
  constructor(private _storage: Storage) {
    this._init().then(() => (this.cache = new Cache(_storage)));
  }

  private async _init() {
    await this._storage.create();
  }

  public setAuthToken(token: string) {
    this._storage.set(StorageKeys.authToken, token);
  }

  public getAuthToken(): Promise<string> {
    return this._storage.get(StorageKeys.authToken);
  }

  public setCredentials(creds: UserCredentials) {
    return this._storage.set(StorageKeys.creds, creds);
  }

  public getCredentials(): Promise<UserCredentials | undefined> {
    return this._storage.get(StorageKeys.creds);
  }

  public setIncome(income: UserIncome) {
    return this._storage.set(StorageKeys.income, income);
  }

  public getIncome(): Promise<UserIncome | undefined> {
    return this._storage.get(StorageKeys.income);
  }
}
