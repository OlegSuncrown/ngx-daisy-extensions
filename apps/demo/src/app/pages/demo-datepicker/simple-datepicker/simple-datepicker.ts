import { DatePipe } from '@angular/common';
import { GridCellWidget } from '@angular/aria/grid';
import { Component, effect, ElementRef, inject, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  DxeDatepickerGrid,
  DxeDatepickerImports,
  DxeDatepickerInput,
  DxeDatepickerRoot,
  DxeDatepickerService,
  type CalendarCell,
} from 'ngx-daisy-extensions';

@Component({
  selector: 'app-simple-datepicker',
  imports: [DxeDatepickerImports, DatePipe],
  providers: [provideNativeDateAdapter(), DxeDatepickerService],
  templateUrl: './simple-datepicker.html',
  host: {
    class: 'block',
  },
})
export class SimpleDatepicker {
  readonly datepickerService = inject(DxeDatepickerService);
  private readonly dayButtons = viewChildren(GridCellWidget);

  readonly picker = viewChild.required<DxeDatepickerRoot>(DxeDatepickerRoot);
  readonly grid = viewChild(DxeDatepickerGrid);
  readonly gridTable = viewChild<ElementRef<HTMLElement>>('gridTable');
  readonly datepickerInput = viewChild.required(DxeDatepickerInput);

  readonly selectedDate = signal<Date | null>(null);
  readonly inputValue = signal('');
  readonly viewMonth = this.datepickerService.viewMonth;
  readonly activeDate = signal(this.datepickerService.today());
  readonly focusTargetDate = signal<Date | null>(null);

  readonly monthYearLabel = this.datepickerService.monthYearLabel;
  readonly activeMonthAnnouncement = this.datepickerService.activeMonthAnnouncement;

  readonly prevMonthNumDays = this.datepickerService.prevMonthNumDays;
  readonly daysFromPrevMonth = this.datepickerService.daysFromPrevMonth;

  readonly weekdays = this.datepickerService.weekdays;
  readonly weeks = this.datepickerService.weeks;

  readonly daysInNextMonth = this.datepickerService.daysInNextMonth;

  constructor() {
    effect(() => {
      if (this.picker().expanded() !== true) {
        return;
      }

      untracked(() => {
        const targetDate = this.selectedDate() ?? this.datepickerService.today();
        this.activeDate.set(targetDate);
        this.viewMonth.set(targetDate);
      });
    });

    effect(() => {
      const target = this.focusTargetDate();
      if (!target) {
        return;
      }

      const buttons = this.dayButtons();
      if (this.datepickerService.isOutsideViewMonth(target)) {
        return;
      }

      const dayOfMonth = this.datepickerService.getDate(target);
      const targetBtn = buttons.find((btn) => Number(btn.element.getAttribute('data-day')) === dayOfMonth);
      if (targetBtn) {
        targetBtn.element.focus();
        Promise.resolve().then(() => {
          untracked(() => this.focusTargetDate.set(null));
        });
      }
    });
  }

  isFocusTarget(date: Date) {
    const target = this.focusTargetDate();
    return target ? this.datepickerService.compareDate(date, target) === 0 : false;
  }

  isSelected(date: Date) {
    const selected = this.selectedDate();
    return selected ? this.datepickerService.compareDate(date, selected) === 0 : false;
  }

  isFocusDate(date: Date) {
    const selected = this.selectedDate();
    const focusDate = selected ?? this.datepickerService.today();
    return this.datepickerService.compareDate(date, focusDate) === 0;
  }

  isToday(date: Date) {
    return this.datepickerService.isToday(date);
  }

  isActive(date: Date) {
    return this.datepickerService.compareDate(date, this.activeDate()) === 0;
  }

  onValueChange(value: string) {
    this.inputValue.set(value);
    const parsedDate = this.parseDate(value);
    if (parsedDate) {
      this.activeDate.set(parsedDate);
      this.viewMonth.set(parsedDate);
    }
  }

  onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const parsedDate = this.parseDate(this.inputValue());
      if (parsedDate) {
        this.activeDate.set(parsedDate);
        this.viewMonth.set(parsedDate);
        this.selectedDate.set(parsedDate);
        this.picker().dismiss();
      }
      return;
    }

    if (event.key === 'ArrowDown' && this.picker().expanded()) {
      this.focusGrid();
    }
  }

  prevMonth() {
    this.datepickerService.prevMonth();
  }

  nextMonth() {
    this.datepickerService.nextMonth();
  }

  selectDate(day: CalendarCell, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.inputValue.set(this.formatDate(day.date));
    this.activeDate.set(day.date);
    this.selectedDate.set(day.date);
    this.datepickerInput().focus();
    this.picker().dismiss();
  }

  onGridKeydown(event: KeyboardEvent) {
    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';
    const arrowLeft = event.key === 'ArrowLeft';
    const arrowRight = event.key === 'ArrowRight';
    const pageUp = event.key === 'PageUp';
    const pageDown = event.key === 'PageDown';
    const homeKey = event.key === 'Home';
    const endKey = event.key === 'End';

    if (!arrowUp && !arrowDown && !arrowLeft && !arrowRight && !pageUp && !pageDown && !homeKey && !endKey) {
      return;
    }

    const dayAttr = (event.target as HTMLElement).getAttribute('data-day');
    if (!dayAttr) {
      return;
    }

    const day = Number(dayAttr);
    const targetDate = this.datepickerService.getTargetDate(day, event.key, event.ctrlKey);

    if (targetDate) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.navigateToDate(targetDate);
    }
  }

  private focusGrid() {
    setTimeout(() => {
      const tableEl = this.gridTable()?.nativeElement;
      if (tableEl) {
        const tabbable = tableEl.querySelector('[tabindex="0"]') as HTMLElement | null;
        (tabbable ?? tableEl).focus();
      }
    });
  }

  private navigateToDate(targetDate: Date) {
    const outsideViewMonth = this.datepickerService.isOutsideViewMonth(targetDate);
    this.activeDate.set(targetDate);

    if (outsideViewMonth) {
      this.gridTable()?.nativeElement.focus();
      this.grid()?.resetFocus();
      this.focusTargetDate.set(targetDate);
      this.viewMonth.set(targetDate);
    } else {
      this.focusTargetDate.set(targetDate);
    }
  }

  private formatDate(date: Date) {
    return this.datepickerService.formatDate(date);
  }

  private parseDate(value: string) {
    return this.datepickerService.parseDate(value);
  }
}
