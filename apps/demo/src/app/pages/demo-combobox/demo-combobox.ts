import { Component } from '@angular/core';
import { DemoCode } from '../../shared/demo-code/demo-code';
import { AsyncCombobox } from './async-combobox/async-combobox';
import {
  ASYNC_COMBOBOX_HTML,
  ASYNC_COMBOBOX_TS,
  FORM_COMBOBOX_HTML,
  FORM_COMBOBOX_TS,
  MULTI_COMBOBOX_HTML,
  MULTI_COMBOBOX_TS,
  SIMPLE_COMBOBOX_HTML,
  SIMPLE_COMBOBOX_TS,
} from './code-snippets';
import { FormCombobox } from './form-combobox/form-combobox';
import { MultiDialogCombobox } from './multi-dialog-combobox/multi-dialog-combobox';
import { SimpleDialogCombobox } from './simple-dialog-combobox/simple-dialog-combobox';

@Component({
  selector: 'app-demo-combobox-page',
  imports: [SimpleDialogCombobox, MultiDialogCombobox, AsyncCombobox, FormCombobox, DemoCode],
  templateUrl: './demo-combobox.html',
})
export class DemoComboboxPage {
  readonly simpleComboboxHtml = SIMPLE_COMBOBOX_HTML;
  readonly simpleComboboxTs = SIMPLE_COMBOBOX_TS;
  readonly multiComboboxHtml = MULTI_COMBOBOX_HTML;
  readonly multiComboboxTs = MULTI_COMBOBOX_TS;
  readonly asyncComboboxHtml = ASYNC_COMBOBOX_HTML;
  readonly asyncComboboxTs = ASYNC_COMBOBOX_TS;
  readonly formComboboxHtml = FORM_COMBOBOX_HTML;
  readonly formComboboxTs = FORM_COMBOBOX_TS;
}
