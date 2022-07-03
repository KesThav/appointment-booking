import { HttpClient } from '@angular/common/http';
import { filter, Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { collection, addDoc,Firestore,getDocs } from '@angular/fire/firestore';

@Injectable()
export class TimeSlotService{

  timeSlots: any[] = [];

  TimeSlotSuject = new Subject<any[]>();

  app!: any;

  emitTimeSlotSubject() {
    this.TimeSlotSuject.next(this.timeSlots.slice());
  }

  constructor(private httpClient: HttpClient, private firestore: Firestore) {
  }



  async createTimeSlots(form: any) {
    let temp = [];
    let startDate = new Date(form['date']);
    let endDate = new Date(form['endDate']);
    if (form['recurrent']) {
      while (startDate < endDate) {
        temp.push({date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'] })
        startDate = new Date(startDate.setDate(startDate.getDate()+1));
      }  
    } else {
      temp.push({ date: form['date'], info: "Available", time: form['startTime'] + "-" + form['endTime'] })
    }
    
    try {
      for (let timeslot of temp) {
        const docRef = await addDoc(collection(this.firestore, "timeslots"), timeslot).then(() => 
       console.log("data added !"));
      }

    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    this.emitTimeSlotSubject();
  }

  async getTimeSlots() {
    const ref = await getDocs(collection(this.firestore, 'timeslots'))
    ref.docs.filter(doc => new Set(doc.id)).forEach(doc => {
      this.timeSlots.push({ date: new Date(doc.data()['date']['seconds']*1000), time : doc.data()['time'], info: doc.data()['info'] })
    })
    //this.emitTimeSlotSubject();
    return this.timeSlots
  }

  }

