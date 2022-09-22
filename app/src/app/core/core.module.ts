import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [ShowHidePasswordComponent],
  exports: [ShowHidePasswordComponent],
})
export class CoreModule {}
