import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { filter, Subject } from 'rxjs';
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
    this.TimeSlotSuject.next(this.timeSlots.slice());
  }

  constructor(private httpClient: HttpClient, private firestore: Firestore) {
  }


  async createTimeSlots(form: any) {
    let token: any = localStorage.getItem('tokenid')
    let decode_token:any = jwt_decode(token);
    let temp = [];
    let startDate = new Date(form['date']);
    let endDate = new Date(form['endDate']);
    if (form['recurrent']) {
      while (startDate < endDate) {
        temp.push({userid: decode_token.user_id, date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'], customer:"",title:"" })
        startDate = new Date(startDate.setDate(startDate.getDate()+1));
      }  
    } else {
      temp.push({userid: decode_token.user_id, date: form['date'], info: "Available", time: form['startTime'] + "-" + form['endTime'],customer:"",title:"" })
    }
    
    try {
      for (let timeslot of temp) {
        console.log(temp);
        const docRef = await addDoc(collection(this.firestore, "timeslots"), timeslot).then(() => 
       console.log("data added !"));
      }

    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
    this.emitTimeSlotSubject();
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
        color: '#2CAA4C', background : '#E9F7EC'})
    })
    //this.emitTimeSlotSubject();
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
    })
  }

  }

