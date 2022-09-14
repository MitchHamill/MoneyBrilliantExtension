import { Component } from '@angular/core';
import { TabsService } from '../services/tabs/tabs.service';
import { TabType } from '../types';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(private tabsService: TabsService) {}

  public selectAnalytics() {
    this.tabsService.tab = TabType.analytics;
  }

  public selectSummary() {
    this.tabsService.tab = TabType.summary;
  }

  public selectSettings() {
    this.tabsService.tab = TabType.settings;
  }
}
