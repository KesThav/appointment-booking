import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.css']
})
export class CalendarWeekComponent implements OnInit {

  currentDate: Date = new Date();
  dayNumber!: any[];
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  constructor() { }

  ngOnInit(){
    this.dayNumber = this.setCalendar(this.currentDate);
  }

  getNextWeek() {
    this.dayNumber = this.setCalendar(this.getNextDay(this.dayNumber[this.dayNumber.length-1]))
  }

  getPreviousWeek() {
    this.dayNumber = this.setCalendar(this.getPreviousDay(this.dayNumber[0]))
  }

  setCalendar(date:Date) {
    return this.adjustDay(date);
  }

  adjustDay(date: Date) {
    let temp = [date];
    let day = date.getDay();
    let adjustBefore = day != 1;
    let adjustAfter = day != 0;
    if (adjustBefore) {
      if (day == 0) day = 7;
      let numberofAdd = day - 1;
      let i = 0;
      let newdate = date;
      while (i < numberofAdd) {
        newdate = this.getPreviousDay(newdate);
        temp.unshift(newdate)
        i++;
      }
    }
    if (adjustAfter) {
      let numberofAdd = 7 - day;
      let i = 0;
      let newdate = date;
      while (i < numberofAdd) {
        newdate = this.getNextDay(newdate);
        temp.push(newdate);
        i++;
      }
    }
    return temp
  }

  getPreviousDay(date:Date) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    return previous;
  }

  getNextDay(date:Date) {
    const next = new Date(date.getTime());
    next.setDate(date.getDate() + 1);

    return next;
  }

}