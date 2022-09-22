import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { MoneyBrilliantService } from 'src/app/services/money-brilliant/money-brilliant.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PaymentFrequency, UserCredentials, UserIncome } from 'src/app/types';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  public loading = true;

  public paymentFrequencies = Object.values(PaymentFrequency);
  public incomeForm: FormGroup;
  public credentialsForm: FormGroup;

  public newForms: any = {
    income: true,
    credentials: true,
  };

  constructor(
    private alertController: AlertController,
    private fb: FormBuilder,
    private storage: StorageService,
    private mb: MoneyBrilliantService
  ) {
    this.incomeForm = fb.group({
      frequency: ['', [Validators.required]],
      takeHome: ['', [Validators.required]],
    });

    this.credentialsForm = fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    const incomeLookup = this.storage.getIncome().then((income) => {
      if (income) {
        this.incomeForm.setValue(income);
        this.newForms.income = false;
      }
    });

    const credentialLookup = this.storage.getCredentials().then((creds) => {
      if (creds) {
        this.credentialsForm.setValue(creds);
        this.newForms.credentials = false;
      }
    });

    Promise.all([incomeLookup, credentialLookup]).then(() => {
      this.loading = false;
    });
  }

  public submitButton(form: string) {
    return this.newForms[form] ? 'Save' : 'Update';
  }

  private _alert(message: string) {
    return this.alertController
      .create({
        header: 'Complete',
        message: [
          message,
          'A tick animation would be way better than an alert here',
        ].join('<br />'),
        buttons: ['Ok'],
      })
      .then((alert) => alert.present());
  }

  public async saveIncome() {
    const income: UserIncome = this.incomeForm.value;

    await this.storage.setIncome(income);
    this.incomeForm.markAsUntouched();
    this.newForms.income = false;
    await this._alert('Income details saved successfully');
  }

  public async saveCredentials() {
    const credentials: UserCredentials = this.credentialsForm.value;

    if (this.mb.authenticationStatus.value === false) {
      this.mb.getNewToken(credentials);
    }

    await this.storage.setCredentials(credentials);
    await this.credentialsForm.markAsUntouched();
    this.newForms.credentials = false;
    await this._alert('Credentials details saved successfully');
  }
}
