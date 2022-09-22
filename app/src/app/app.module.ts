import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoneyBrilliantService } from './services/money-brilliant/money-brilliant.service';
import { StorageService } from './services/storage/storage.service';
import { TabsService } from './services/tabs/tabs.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Storage,
    TabsService,
    StorageService,
    MoneyBrilliantService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
