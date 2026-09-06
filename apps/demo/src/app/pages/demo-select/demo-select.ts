import { Component } from '@angular/core';
import { DemoCode } from '../../shared/demo-code/demo-code';
import {
  MULTI_SELECT_HTML,
  MULTI_SELECT_TS,
  SELECT_COLORS_HTML,
  SELECT_COLORS_TS,
  SELECT_SIZES_HTML,
  SELECT_SIZES_TS,
  SIMPLE_SELECT_HTML,
  SIMPLE_SELECT_TS,
} from './code-snippets';
import { MultiSelect } from './multi-select/multi-select';
import { SelectColors } from './select-colors/select-colors';
import { SelectSizes } from './select-sizes/select-sizes';
import { SimpleSelect } from './simple-select/simple-select';

@Component({
  selector: 'app-demo-select-page',
  imports: [SimpleSelect, MultiSelect, SelectSizes, SelectColors, DemoCode],
  templateUrl: './demo-select.html',
})
export class DemoSelectPage {
  readonly simpleSelectHtml = SIMPLE_SELECT_HTML;
  readonly simpleSelectTs = SIMPLE_SELECT_TS;
  readonly multiSelectHtml = MULTI_SELECT_HTML;
  readonly multiSelectTs = MULTI_SELECT_TS;
  readonly selectSizesHtml = SELECT_SIZES_HTML;
  readonly selectSizesTs = SELECT_SIZES_TS;
  readonly selectColorsHtml = SELECT_COLORS_HTML;
  readonly selectColorsTs = SELECT_COLORS_TS;
}
