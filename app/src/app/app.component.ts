import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoneyBrilliantService } from './services/money-brilliant/money-brilliant.service';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public loading = true;
  public overview: any;
  constructor(
    private router: Router,
    private _moneyBrilliant: MoneyBrilliantService,
    private storage: StorageService
  ) {}

  async ngOnInit() {
    const initiated = await this._moneyBrilliant.init().then((res) => {
      if (!res.authenticated) {
        return this.storage.getCredentials().then((creds) => {
          if (creds) {
            return this._moneyBrilliant
              .getNewToken(creds)
              .then(() => true)
              .catch(() => false);
          } else {
            this.router.navigate(['tabs/settings']);
          }
        });
      }
    });
    this.loading = false;
  }
}
