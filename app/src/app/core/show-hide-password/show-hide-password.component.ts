import { Component, ContentChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

// Component taken straight from https://medium.com/learn-ionic-framework/create-a-show-hide-password-component-in-ionic-angular-a3960094726a

@Component({
  selector: 'show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
})
export class ShowHidePasswordComponent {
  showPassword = false;
  @ContentChild(IonInput) input: IonInput;
  constructor() {}
  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }
}
