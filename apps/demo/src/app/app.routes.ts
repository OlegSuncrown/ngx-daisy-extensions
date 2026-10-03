import { Routes } from '@angular/router';

import { DemoComboboxPage } from './pages/demo-combobox/demo-combobox';
import { DemoDatepickerPage } from './pages/demo-datepicker/demo-datepicker';
import { DemoSelectPage } from './pages/demo-select/demo-select';
import { DemoSignalFormPage } from './pages/demo-signal-form/demo-signal-form';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'select', pathMatch: 'full' },
  { path: 'select', component: DemoSelectPage },
  { path: 'combobox', component: DemoComboboxPage },
  { path: 'datepicker', component: DemoDatepickerPage },
  { path: 'signal-form', component: DemoSignalFormPage },
];
