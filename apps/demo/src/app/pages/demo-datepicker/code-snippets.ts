export const SIMPLE_DATEPICKER_HTML = `<dxe-datepicker-root #picker>
  <dxe-datepicker-trigger>
    <svg class="size-4 opacity-60 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5" />
      <path d="M2 6.5h12M5 2v2.5M11 2v2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <input
      type="text"
      dxeDatepickerInput
      placeholder="Pick a date..."
      [(value)]="inputValue"
      (input)="onInput(inputValue())"
      (keydown)="onInputKeydown($event)"
    />
  </dxe-datepicker-trigger>

  <ng-container *dxeDatepickerPortal>
    <dxe-datepicker-header (previous)="prevMonth()" (next)="nextMonth()">
      <div aria-live="polite" class="sr-only">{{ activeMonthAnnouncement() }}</div>
      <div class="font-semibold text-sm">{{ monthYearLabel() }}</div>
    </dxe-datepicker-header>

    <table
      #gridTable
      tabindex="-1"
      ngGrid
      #grid="ngGrid"
      class="w-full table-fixed"
      colWrap="continuous"
      rowWrap="nowrap"
      [enableSelection]="true"
      selectionMode="explicit"
      (keydown)="onGridKeydown($event)"
    >
      <thead>
        <tr>
          @for (day of weekdays(); track day.long) {
            <th
              role="columnheader"
              scope="col"
              class="text-xs font-medium text-base-content/60 text-center pb-2"
              [attr.abbr]="day.long"
            >
              {{ day.narrow }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (week of weeks(); track $index) {
          <tr ngGridRow>
            @if ($first) {
              @for (day of daysFromPrevMonth(); track $index) {
                <td
                  class="p-0 h-10 text-center align-middle text-sm text-base-content/30"
                  ngGridCell
                  [disabled]="true"
                  aria-hidden="true"
                  [tabindex]="-1"
                >
                  {{ day }}
                </td>
              }
            }
            @for (day of week; track $index) {
              <td class="p-0 h-10 text-center align-middle" ngGridCell [selected]="day.selected">
                <button
                  ngGridCellWidget
                  type="button"
                  class="leading-none btn btn-circle btn-sm"
                  [class.btn-primary]="day.selected"
                  [class.btn-ghost]="!day.selected"
                  [class.btn-outline]="day.today && !day.selected"
                  [attr.data-day]="day.displayName"
                  [attr.data-focus-target]="isFocusTarget(day.date)"
                  [attr.aria-label]="day.ariaLabel + (day.selected ? ', Selected' : '')"
                  (click)="selectDate(day, $event)"
                  (keydown.enter)="selectDate(day, $event)"
                  (keydown.space)="selectDate(day, $event)"
                >
                  {{ day.displayName }}
                </button>
              </td>
            }
            @if ($last && week.length < 7) {
              @for (day of daysInNextMonth(); track $index) {
                <td
                  class="p-0 h-10 text-center align-middle text-sm text-base-content/30"
                  ngGridCell
                  [disabled]="true"
                  aria-hidden="true"
                  [tabindex]="-1"
                >
                  {{ day }}
                </td>
              }
            }
          </tr>
        }
      </tbody>
    </table>
  </ng-container>
</dxe-datepicker-root>`;

export const SIMPLE_DATEPICKER_TS = `import { Grid, GridCell, GridCellWidget, GridRow } from '@angular/aria/grid';
import { Component, computed, effect, inject, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { DxeDatepickerImports, DxeDatepickerRoot } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-simple-datepicker',
  imports: [DxeDatepickerImports, Grid, GridRow, GridCell, GridCellWidget],
  providers: [provideNativeDateAdapter()],
  templateUrl: './simple-datepicker.html',
})
export class SimpleDatepicker {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private readonly dateFormats = inject(MAT_DATE_FORMATS);

  readonly picker = viewChild.required<DxeDatepickerRoot>(DxeDatepickerRoot);
  readonly selectedDate = signal<Date | null>(null);
  readonly inputValue = signal('');
  readonly viewMonth = signal(this.dateAdapter.today());

  readonly monthYearLabel = computed(() =>
    this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel).toLocaleUpperCase(),
  );

  readonly activeMonthAnnouncement = computed(
    () => \`Showing \${this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel)}\`,
  );

  // Build weekdays, weeks, and adjacent-month filler days with DateAdapter.
  // Handle input parse/format, month navigation, and grid key boundaries here.
}`;
