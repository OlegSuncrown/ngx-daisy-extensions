import { computed, inject, Service, signal } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

const DAYS_PER_WEEK = 7;

export interface CalendarCell {
  dayOfMonth: number;
  displayName: string;
  ariaLabel: string;
  date: Date;
}

@Service({ autoProvided: false })
export class DxeDatepickerService {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private readonly dateFormats = inject(MAT_DATE_FORMATS);
  readonly viewMonth = signal(this.dateAdapter.today());

  readonly monthYearLabel = computed(() =>
    this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel).toLocaleUpperCase(),
  );

  readonly activeMonthAnnouncement = computed(
    () => `Showing ${this.dateAdapter.format(this.viewMonth(), this.dateFormats.display.monthYearLabel)}`,
  );

  readonly firstWeekOffset = computed(() => {
    const firstOfMonth = this.dateAdapter.createDate(
      this.dateAdapter.getYear(this.viewMonth()),
      this.dateAdapter.getMonth(this.viewMonth()),
      1,
    );

    return (DAYS_PER_WEEK + this.dateAdapter.getDayOfWeek(firstOfMonth) - this.dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
  });

  readonly prevMonthNumDays = computed(() => this.dateAdapter.getNumDaysInMonth(this.dateAdapter.addCalendarMonths(this.viewMonth(), -1)));
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
    const daysInMonth = this.dateAdapter.getNumDaysInMonth(viewMonth);
    const dateNames = this.dateAdapter.getDateNames();
    const weeks: CalendarCell[][] = [[]];

    for (let i = 0, cell = this.firstWeekOffset(); i < daysInMonth; i++, cell++) {
      if (cell === DAYS_PER_WEEK) {
        weeks.push([]);
        cell = 0;
      }

      const date = this.dateAdapter.createDate(this.dateAdapter.getYear(viewMonth), this.dateAdapter.getMonth(viewMonth), i + 1);

      weeks[weeks.length - 1].push({
        dayOfMonth: i + 1,
        displayName: dateNames[i],
        ariaLabel: this.dateAdapter.format(date, this.dateFormats.display.dateA11yLabel),
        date,
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

  parseDate(value: string) {
    const parsedDate = this.dateAdapter.parse(value, this.dateFormats.display.dateInput);
    return parsedDate && this.dateAdapter.isValid(parsedDate) ? parsedDate : null;
  }

  formatDate(date: Date) {
    return this.dateAdapter.format(date, this.dateFormats.display.dateInput);
  }

  compareDate(date1: Date, date2: Date) {
    return this.dateAdapter.compareDate(date1, date2);
  }

  today() {
    return this.dateAdapter.today();
  }

  isToday(date: Date) {
    return this.compareDate(date, this.today()) === 0;
  }

  prevMonth() {
    this.viewMonth.update((month) => this.dateAdapter.addCalendarMonths(month, -1));
  }

  nextMonth() {
    this.viewMonth.update((month) => this.dateAdapter.addCalendarMonths(month, 1));
  }

  getTargetDate(day: number, key: string, ctrlKey: boolean) {
    const year = this.dateAdapter.getYear(this.viewMonth());
    const month = this.dateAdapter.getMonth(this.viewMonth());
    const viewMonthNumDays = this.dateAdapter.getNumDaysInMonth(this.viewMonth());
    const currentFocusedDate = this.dateAdapter.createDate(year, month, day);
    let targetDate: Date | null = null;

    switch (key) {
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
        targetDate = this.dateAdapter.addCalendarMonths(currentFocusedDate, ctrlKey ? -12 : -1);
        break;
      case 'PageDown':
        targetDate = this.dateAdapter.addCalendarMonths(currentFocusedDate, ctrlKey ? 12 : 1);
        break;
      case 'Home':
        targetDate = this.dateAdapter.createDate(year, month, 1);
        break;
      case 'End':
        targetDate = this.dateAdapter.createDate(year, month, viewMonthNumDays);
        break;
    }
    return targetDate;
  }

  isOutsideViewMonth(targetDate: Date) {
    const currentMonth = this.dateAdapter.getMonth(this.viewMonth());
    const currentYear = this.dateAdapter.getYear(this.viewMonth());
    const targetMonth = this.dateAdapter.getMonth(targetDate);
    const targetYear = this.dateAdapter.getYear(targetDate);
    return currentMonth !== targetMonth || currentYear !== targetYear;
  }

  getDate(date: Date) {
    return this.dateAdapter.getDate(date);
  }
}
