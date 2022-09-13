import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import Cache from './cache';
import { Transaction } from '../money-brilliant/types';

export enum StorageKeys {
  authToken = 'auth_token',
  transactions = 'transactions',
  overview = 'overview',
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
}
