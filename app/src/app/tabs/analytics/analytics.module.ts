import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsPage } from './analytics.page';

import { AnalyticsPageRoutingModule } from './analytics-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, AnalyticsPageRoutingModule],
  declarations: [AnalyticsPage],
})
export class AnalyticsPageModule {}
