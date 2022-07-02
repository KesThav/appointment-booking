import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class AppointmentService {

  appointmentSubject = new Subject<any[]>();

  appointments = [{
    date: new Date(),
    time: "11:00 - 11:00",
    info: "Blood checklidjhf ldhshfahdsflhadshf s hdf asdfsd f",
    color: "#EB6722",
    background: "white",
    status : "Waiting"
  },{
    date: new Date(),
    time: "11:00 - 11:00",
    info: "Blood check",
    color: "#EB6722",
    background: "#FBEFE6",
    status : "Confirmed"
  },{
    date: new Date(),
    time: "11:00 - 11:00",
    info: "Blood check",
    color: "#EB6722",
    background: "#FBEFE6",
    status : "Confirmed"
    },
    {
      date: new Date(2022, 11, 10),
      time: "11:00 - 11:00",
      info: "Blood check",
      color: "#EB6722",
      background: "#FBEFE6",
      status : "Confirm"
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


