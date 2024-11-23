declare module 'telegraf-calendar-telegram' {
  import { Telegraf, Context } from 'telegraf';

  interface CalendarOptions {
    startWeekDay?: number;
    weekDayNames?: string[];
    monthNames?: string[];
    minDate?: Date;
    maxDate?: Date;
    shortWeekDayNames?: boolean;
  }

  class Calendar {
    constructor(bot: Telegraf<Context>, options?: CalendarOptions);
    getCalendar(date?: Date): Promise<any>;
    getDateFromCallback(callback: string): Date | null;
    setMinDate(date: Date): Calendar;
    setMaxDate(date: Date): Calendar;
    setWeekDayNames(names: string[]): Calendar;
    setMonthNames(names: string[]): Calendar;
    setStartWeekDay(startDay: number): Calendar;
  }

  export = Calendar;
} 