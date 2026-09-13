export const SIMPLE_DATEPICKER_HTML = `<dxe-datepicker-root #picker [(value)]="selectedDate" [compareWith]="isSameDay">
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

    <dxe-datepicker-grid>
      <dxe-datepicker-weekdays>
        @for (day of weekdays(); track day.long) {
          <dxe-datepicker-weekday [label]="day.long">{{ day.narrow }}</dxe-datepicker-weekday>
        }
      </dxe-datepicker-weekdays>

      @for (week of weeks(); track $index) {
      <dxe-datepicker-week>
        @if ($first) {
          @for (day of daysFromPrevMonth(); track $index) {
            <dxe-datepicker-day disabled>{{ day }}</dxe-datepicker-day>
          }
        }
        @for (day of week; track $index) {
          <dxe-datepicker-day
            [value]="day.date"
            [label]="day.ariaLabel"
            [today]="day.today"
            (keydown)="onDayKeydown($event, day.date)"
          >
            {{ day.displayName }}
          </dxe-datepicker-day>
        }
        @if ($last) {
          @for (day of daysInNextMonth(); track $index) {
            <dxe-datepicker-day disabled>{{ day }}</dxe-datepicker-day>
          }
        }
      </dxe-datepicker-week>
      }
    </dxe-datepicker-grid>
  </ng-container>
</dxe-datepicker-root>`;

export const SIMPLE_DATEPICKER_TS = `import { Component, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { DxeDatepickerImports, DxeDatepickerRoot } from 'ngx-daisy-extensions';

@Component({
  selector: 'app-simple-datepicker',
  imports: [DxeDatepickerImports],
  providers: [provideNativeDateAdapter()],
  templateUrl: './simple-datepicker.html',
})
export class SimpleDatepicker {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private readonly dateFormats = inject(MAT_DATE_FORMATS);

  readonly picker = viewChild.required<DxeDatepickerRoot<Date>>(DxeDatepickerRoot);
  readonly selectedDate = signal<Date | null>(null);
  readonly inputValue = signal('');
  readonly viewMonth = signal(this.dateAdapter.today());

  readonly isSameDay = (a: Date, b: Date) => this.dateAdapter.compareDate(a, b) === 0;

  readonly monthYearLabel = computed(() =>
    this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel).toLocaleUpperCase(),
  );

  readonly activeMonthAnnouncement = computed(
    () => \`Showing \${this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel)}\`,
  );

  // Build weekdays, weeks, and adjacent-month filler days with DateAdapter.
  // Handle input parse/format, month navigation, and grid key boundaries here.
}`;
