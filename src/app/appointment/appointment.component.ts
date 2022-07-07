import { TimeSlotService } from './../service/timeslot.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointementComponent implements OnInit {

  active: number = 1;
  timeSlotsSubscription!: Subscription;
  timeSlots!: any[];

  constructor(private timeSlotService:TimeSlotService) { }

  ngOnInit(): void {
    this.timeSlotsSubscription = this.timeSlotService.TimeSlotSuject.subscribe(async (timeSlot: any[]) => {
      this.timeSlots = await this.timeSlotService.getTimeSlots('');
    })
    this.timeSlotService.emitTimeSlotSubject();
  }

  async setFilter(id:number,type:string) {
    this.active = id;
    this.timeSlots = await this.timeSlotService.getTimeSlots(type);
  }

}
