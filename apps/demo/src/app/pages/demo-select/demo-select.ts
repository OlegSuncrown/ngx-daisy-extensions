import { Component } from '@angular/core';
import { SimpleSelect } from './simple-select/simple-select';
import { MultiSelect } from './multi-select/multi-select';
import { SelectSizes } from './select-sizes/select-sizes';
import { SelectColors } from './select-colors/select-colors';

@Component({
  selector: 'app-demo-select-page',
  imports: [SimpleSelect, MultiSelect, SelectSizes, SelectColors],
  templateUrl: './demo-select.html',
})
export class DemoSelectPage {}
