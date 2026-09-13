import { Component } from '@angular/core';
import { DemoCode } from '../../shared/demo-code/demo-code';
import { SIMPLE_DATEPICKER_HTML, SIMPLE_DATEPICKER_TS } from './code-snippets';
import { SimpleDatepicker } from './simple-datepicker/simple-datepicker';

@Component({
  selector: 'app-demo-datepicker-page',
  imports: [SimpleDatepicker, DemoCode],
  templateUrl: './demo-datepicker.html',
})
export class DemoDatepickerPage {
  readonly simpleDatepickerHtml = SIMPLE_DATEPICKER_HTML;
  readonly simpleDatepickerTs = SIMPLE_DATEPICKER_TS;
}
