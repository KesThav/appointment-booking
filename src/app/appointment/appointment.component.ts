import { AuthService } from './../service/auth.service';
import { TimeSlotService } from './../service/timeslot.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointementComponent implements OnInit {

  active: number = 0;
  timeSlotsSubscription!: Subscription;
  timeSlots!: any[];

  constructor(private timeSlotService:TimeSlotService,public authService:AuthService) { }

  ngOnInit(): void {
    this.timeSlotsSubscription = this.timeSlotService.TimeSlotSuject.subscribe(async (timeSlot: any[]) => {
      this.timeSlotService.filter_userid = [this.authService.user_data.user_id];
      this.timeSlots = await this.timeSlotService.getTimeSlots('Pending');
    })
    this.timeSlotService.emitTimeSlotSubject();
  }

  async setFilter(id:number,type:string) {
    this.active = id;
    this.timeSlots = await this.timeSlotService.getTimeSlots(type);
  }

  getRole() {
    return this.authService.current_user.role;
  }

}
