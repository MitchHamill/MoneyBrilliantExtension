import { IonicModule, IonVirtualScroll } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryPage } from './summary.page';

import { SummaryPageRoutingModule } from './summary-routing.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SummaryPageRoutingModule,
    NgChartsModule,
  ],
  declarations: [SummaryPage],
  exports: [IonVirtualScroll],
})
export class SummaryPageModule {}
