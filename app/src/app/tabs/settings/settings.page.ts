import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PaymentFrequency, UserIncome } from 'src/app/types';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  public loading = true;

  public paymentFrequencies = Object.values(PaymentFrequency);
  public incomeForm: FormGroup;

  constructor(
    private alertController: AlertController,
    private fb: FormBuilder,
    private storage: StorageService
  ) {
    this.incomeForm = fb.group({
      frequency: ['', [Validators.required]],
      takeHome: ['', [Validators.required]],
    });

    this.storage.getIncome().then((income) => {
      if (income) {
        this.incomeForm.setValue(income);
      }
      this.loading = false;
    });
  }

  public async saveIncome() {
    const income: UserIncome = this.incomeForm.value;

    await this.storage.setIncome(income);
    this.incomeForm.markAsUntouched();
    await this.alertController
      .create({
        header: 'Complete',
        message: [
          'Income details saved successfully',
          'A tick animation would be way better than an alert here',
        ].join('<br />'),
        buttons: ['Ok'],
      })
      .then((alert) => alert.present());
  }
}
