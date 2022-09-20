import { Component, OnInit } from '@angular/core';
import { MoneyBrilliantService } from './services/money-brilliant/money-brilliant.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public loading = true;
  public overview: any;
  constructor(private _moneyBrilliant: MoneyBrilliantService) {}

  async ngOnInit() {
    const initiated = await this._moneyBrilliant.init().then((res) => {
      if (!res.authenticated) {
        return this._moneyBrilliant.getNewToken(
          'mitchhamill@gmail.com',
          'ghog_DUY9prof4mous'
        );
      }
    });
    this.loading = false;
  }
}
