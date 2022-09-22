import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';

import { SettingsPageRoutingModule } from './settings-routing.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    SettingsPageRoutingModule,
    CoreModule,
  ],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
