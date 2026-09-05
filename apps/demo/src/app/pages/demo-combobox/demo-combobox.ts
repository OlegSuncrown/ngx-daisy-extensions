import { Component } from '@angular/core';
import { AsyncCombobox } from './async-combobox/async-combobox';
import { FormCombobox } from './form-combobox/form-combobox';
import { MultiDialogCombobox } from './multi-dialog-combobox/multi-dialog-combobox';
import { SimpleDialogCombobox } from './simple-dialog-combobox/simple-dialog-combobox';

@Component({
  selector: 'app-demo-combobox-page',
  imports: [SimpleDialogCombobox, MultiDialogCombobox, AsyncCombobox, FormCombobox],
  templateUrl: './demo-combobox.html',
})
export class DemoComboboxPage {}
