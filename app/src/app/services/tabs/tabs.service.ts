import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TabType } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  currentTab = new Subject<TabType>();

  constructor() {}

  public set tab(tab: TabType) {
    this.currentTab.next(tab);
  }

  public get $tab() {
    return this.currentTab.asObservable();
  }

  private filterToType(type: TabType) {
    return this.currentTab.pipe(
      filter((tab) => tab === type),
      map(() => true)
    );
  }

  public get $onAnalytics() {
    return this.filterToType(TabType.analytics);
  }

  public get $onSummary() {
    return this.filterToType(TabType.summary);
  }

  public get $onSettings() {
    return this.filterToType(TabType.settings);
  }
}
