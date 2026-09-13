import { DatePipe } from '@angular/common';
import { Grid, GridCell, GridCellWidget, GridRow } from '@angular/aria/grid';
import { Component, computed, effect, ElementRef, inject, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { DxeDatepickerImports, DxeDatepickerRoot } from 'ngx-daisy-extensions';

const DAYS_PER_WEEK = 7;

interface CalendarCell {
  displayName: string;
  ariaLabel: string;
  date: Date;
  selected: boolean;
  today: boolean;
}

interface GridFocusReset {
  gridBehavior?: {
    focusBehavior?: {
      activeCell: { set(value: undefined): void };
      activeCoords: { set(value: { row: number; col: number }): void };
    };
  };
}

@Component({
  selector: 'app-simple-datepicker',
  imports: [DxeDatepickerImports, DatePipe, Grid, GridRow, GridCell, GridCellWidget],
  providers: [provideNativeDateAdapter()],
  templateUrl: './simple-datepicker.html',
  host: {
    class: 'block',
  },
})
export class SimpleDatepicker {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private readonly dateFormats = inject(MAT_DATE_FORMATS);
  private readonly dayButtons = viewChildren(GridCellWidget);

  readonly picker = viewChild.required<DxeDatepickerRoot>(DxeDatepickerRoot);
  readonly grid = viewChild(Grid);
  readonly gridTable = viewChild<ElementRef<HTMLElement>>('gridTable');
  readonly selectedDate = signal<Date | null>(null);
  readonly inputValue = signal('');
  readonly viewMonth = signal(this.dateAdapter.today());
  readonly focusTargetDate = signal<Date | null>(null);

  readonly monthYearLabel = computed(() =>
    this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel).toLocaleUpperCase(),
  );

  readonly activeMonthAnnouncement = computed(
    () => `Showing ${this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel)}`,
  );

  private readonly firstWeekOffset = computed(() => {
    const firstOfMonth = this.dateAdapter.createDate(
      this.dateAdapter.getYear(this.viewMonth()),
      this.dateAdapter.getMonth(this.viewMonth()),
      1,
    );

    return (
      (DAYS_PER_WEEK + this.dateAdapter.getDayOfWeek(firstOfMonth) - this.dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK
    );
  });

  readonly prevMonthNumDays = computed(() =>
    this.dateAdapter.getNumDaysInMonth(this.dateAdapter.addCalendarMonths(this.viewMonth(), -1)),
  );

  readonly daysFromPrevMonth = computed(() => {
    const days: number[] = [];
    for (let i = this.firstWeekOffset() - 1; i >= 0; i--) {
      days.push(this.prevMonthNumDays() - i);
    }
    return days;
  });

  readonly weekdays = computed(() => {
    const firstDayOfWeek = this.dateAdapter.getFirstDayOfWeek();
    const narrowWeekdays = this.dateAdapter.getDayOfWeekNames('narrow');
    const longWeekdays = this.dateAdapter.getDayOfWeekNames('long');
    const weekdays = longWeekdays.map((long, i) => ({ long, narrow: narrowWeekdays[i] }));
    return weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
  });

  readonly weeks = computed(() => {
    const viewMonth = this.viewMonth();
    const selectedDate = this.selectedDate();
    const daysInMonth = this.dateAdapter.getNumDaysInMonth(viewMonth);
    const dateNames = this.dateAdapter.getDateNames();
    const today = this.dateAdapter.today();
    const weeks: CalendarCell[][] = [[]];

    for (let i = 0, cell = this.firstWeekOffset(); i < daysInMonth; i++, cell++) {
      if (cell === DAYS_PER_WEEK) {
        weeks.push([]);
        cell = 0;
      }

      const date = this.dateAdapter.createDate(
        this.dateAdapter.getYear(viewMonth),
        this.dateAdapter.getMonth(viewMonth),
        i + 1,
      );

      weeks[weeks.length - 1].push({
        displayName: dateNames[i],
        ariaLabel: this.dateAdapter.format(date, this.dateFormats.display.dateA11yLabel),
        date,
        selected: selectedDate != null && this.dateAdapter.compareDate(date, selectedDate) === 0,
        today: this.dateAdapter.compareDate(date, today) === 0,
      });
    }

    return weeks;
  });

  readonly daysInNextMonth = computed(() => {
    const activeWeeks = this.weeks();
    const lastWeekLength = activeWeeks[activeWeeks.length - 1]?.length || 0;
    const trailingCount = lastWeekLength > 0 ? 7 - lastWeekLength : 0;
    const days: number[] = [];
    for (let i = 1; i <= trailingCount; i++) {
      days.push(i);
    }
    return days;
  });

  constructor() {
    effect(() => {
      const value = this.selectedDate();
      untracked(() => {
        const formatted = value ? this.formatDate(value) : '';
        if (this.inputValue() !== formatted) {
          this.inputValue.set(formatted);
        }
      });
    });

    effect(() => {
      const target = this.focusTargetDate();
      if (!target) {
        return;
      }

      const targetBtn = this.dayButtons().find((btn) => btn.element.getAttribute('data-focus-target') === 'true');
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
    return target ? this.dateAdapter.compareDate(date, target) === 0 : false;
  }

  onInput(value: string) {
    const parsedDate = this.parseDate(value);
    if (parsedDate) {
      this.viewMonth.set(parsedDate);
    }
  }

  onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const parsedDate = this.parseDate(this.inputValue());
      if (parsedDate) {
        this.viewMonth.set(parsedDate);
        this.selectedDate.set(parsedDate);
        this.picker().close();
      }
      return;
    }

    if (event.key === 'ArrowDown' && this.picker().expanded()) {
      this.focusGrid();
    }
  }

  prevMonth() {
    this.viewMonth.set(this.dateAdapter.addCalendarMonths(this.viewMonth(), -1));
  }

  nextMonth() {
    this.viewMonth.set(this.dateAdapter.addCalendarMonths(this.viewMonth(), 1));
  }

  selectDate(day: CalendarCell, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedDate.set(day.date);
    this.picker().close();
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
    const year = this.dateAdapter.getYear(this.viewMonth());
    const month = this.dateAdapter.getMonth(this.viewMonth());
    const viewMonthNumDays = this.dateAdapter.getNumDaysInMonth(this.viewMonth());
    const currentFocusedDate = this.dateAdapter.createDate(year, month, day);
    let targetDate: Date | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        if (day === 1) {
          targetDate = this.dateAdapter.addCalendarDays(currentFocusedDate, -1);
        }
        break;
      case 'ArrowRight':
        if (day === viewMonthNumDays) {
          targetDate = this.dateAdapter.addCalendarDays(currentFocusedDate, 1);
        }
        break;
      case 'ArrowUp':
        if (day <= 7) {
          targetDate = this.dateAdapter.addCalendarDays(currentFocusedDate, -7);
        }
        break;
      case 'ArrowDown':
        if (day > viewMonthNumDays - 7) {
          targetDate = this.dateAdapter.addCalendarDays(currentFocusedDate, 7);
        }
        break;
      case 'PageUp':
        targetDate = this.dateAdapter.addCalendarMonths(currentFocusedDate, event.ctrlKey ? -12 : -1);
        break;
      case 'PageDown':
        targetDate = this.dateAdapter.addCalendarMonths(currentFocusedDate, event.ctrlKey ? 12 : 1);
        break;
      case 'Home':
        targetDate = this.dateAdapter.createDate(year, month, 1);
        break;
      case 'End':
        targetDate = this.dateAdapter.createDate(year, month, viewMonthNumDays);
        break;
    }

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
    const currentMonth = this.dateAdapter.getMonth(this.viewMonth());
    const currentYear = this.dateAdapter.getYear(this.viewMonth());
    const targetMonth = this.dateAdapter.getMonth(targetDate);
    const targetYear = this.dateAdapter.getYear(targetDate);
    const monthShift = currentMonth !== targetMonth || currentYear !== targetYear;

    if (monthShift) {
      this.gridTable()?.nativeElement.focus();
      const focusBehavior = (this.grid()?._pattern as unknown as GridFocusReset | undefined)?.gridBehavior?.focusBehavior;
      if (focusBehavior) {
        focusBehavior.activeCell.set(undefined);
        focusBehavior.activeCoords.set({ row: -1, col: -1 });
      }
      this.viewMonth.set(targetDate);
    }

    this.focusTargetDate.set(targetDate);
  }

  private formatDate(date: Date) {
    return this.dateAdapter.format(date, this.dateFormats.display.dateInput);
  }

  private parseDate(value: string) {
    const parsedDate = this.dateAdapter.parse(value, this.dateFormats.display.dateInput);
    return parsedDate && this.dateAdapter.isValid(parsedDate) ? parsedDate : null;
  }
}
