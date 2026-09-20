import { Routes } from '@angular/router';

import { DemoComboboxPage } from './pages/demo-combobox/demo-combobox';
import { DemoDatepickerPage } from './pages/demo-datepicker/demo-datepicker';
import { DemoSelectPage } from './pages/demo-select/demo-select';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'select', pathMatch: 'full' },
  { path: 'select', component: DemoSelectPage },
  { path: 'combobox', component: DemoComboboxPage },
  { path: 'datepicker', component: DemoDatepickerPage },
];
