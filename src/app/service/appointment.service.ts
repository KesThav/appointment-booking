import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class AppointmentService {

  appointmentSubject = new Subject<any[]>();

  appointments = [{
    date: new Date(),
    info: "Blood check"
  },{
    date: new Date(),
    info: "Blood check"
  },{
    date: new Date(),
    info: "Blood check"
    },
    {
      date: new Date(2022,11,10),
      info: "Blood check"
      }]
  

  emitAppointmentSubject(){
    this.appointmentSubject.next(this.appointments.slice());
  }

  createAppointement() {
    
  }

  updateAppointment() {
    
  }

  deleteAppointment() {
    
  }

}


