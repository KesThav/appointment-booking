import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { filter, of, Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { collection, addDoc, Firestore, getDocs } from '@angular/fire/firestore';
import { doc, updateDoc, increment } from "firebase/firestore";
import jwt_decode from 'jwt-decode';

@Injectable()
export class TimeSlotService{

  timeSlots: any[] = [];

  TimeSlotSuject = new Subject<any[]>();

  app!: any;

  emitTimeSlotSubject() {
    this.TimeSlotSuject.next(this.timeSlots);
  }

  constructor(private httpClient: HttpClient, private firestore: Firestore) {
  }

  getNextDay(date:Date) {
    const next = new Date(date.getTime());
    next.setDate(date.getDate() + 1);

    return next;
  }


  async createTimeSlots(form: any) {
    let token: any = localStorage.getItem('tokenid')
    let decode_token:any = jwt_decode(token);
    let temp = [];
    let startDate = new Date(form['date']);
    let endDate = new Date(form['endDate']);

    if (form['recurrent']) {
      let days: number[] = [];
      if (form['monday']) days.push(1);
      if (form['tuesday']) days.push(2);
      if (form['wednesday']) days.push(3);
      if (form['thursday']) days.push(4);
      if (form['friday']) days.push(5);
      if (form['saturday']) days.push(6);
      if (form['sunday']) days.push(0);

      while (startDate < endDate) {
        if (days.includes(startDate.getDay())) {
          console.log("Before : " + startDate + " " + startDate.getDay());
          temp.push({ userid: decode_token.user_id, date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'], customer: "", title: "" })
          console.log("After" + startDate + " " + startDate.getDay());
        }

        startDate = this.getNextDay(startDate);
      }  
    } else {
      temp.push({userid: decode_token.user_id, date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'],customer:"",title:"" })
    }
    
    try {
      if (temp.length != 0) {
        for (let timeslot of temp) {
          console.log(timeslot);
          const docRef = await addDoc(collection(this.firestore, "timeslots"), timeslot).then(() => 
            console.log("data added !"));
            this.emitTimeSlotSubject();
        }
      } else {
        console.log("Empty array!")
      }

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  arrayUniqueByKey(array: any[],key:any) {
   return  [...new Map(array.map(item =>
      [item[key], item])).values()];

  }
  async getTimeSlots() {
    const ref = await getDocs(collection(this.firestore, 'timeslots'))
    ref.forEach(doc => {
      this.timeSlots.push({
        id: doc.id, date: new Date(doc.data()['date']['seconds'] * 1000), time: doc.data()['time'], info: doc.data()['info'],
        color: '#2CAA4C', background : '#E9F7EC',userid: doc.data()['userid']})
    })
    return this.arrayUniqueByKey(this.timeSlots, "id");
  }

  async bookTimeSlot(app: any,title:string) {
    console.log(app);
    const token:any = localStorage.getItem('tokenid');
    let decode_token:any = jwt_decode(token);
    const timeslotRef = doc(this.firestore, 'timeslots', app.id)
    await updateDoc(timeslotRef, {
      customer: decode_token.user_id,
      info: "Pending",
      title: title
    }).then(() => {
      this.emitTimeSlotSubject();
    })
  }

  async updateTimeSlot() {
    
  }

  }

