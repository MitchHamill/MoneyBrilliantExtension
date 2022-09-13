import { IonicModule, IonVirtualScroll } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryPage } from './summary.page';

import { SummaryPageRoutingModule } from './summary-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SummaryPageRoutingModule],
  declarations: [SummaryPage],
  exports: [IonVirtualScroll],
})
export class SummaryPageModule {}
