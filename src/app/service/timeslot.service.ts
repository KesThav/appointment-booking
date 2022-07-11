import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { filter, of, Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { collection, addDoc, Firestore, getDocs, deleteDoc } from '@angular/fire/firestore';
import { doc, updateDoc, increment } from "firebase/firestore";
import jwt_decode from 'jwt-decode';

@Injectable()
export class TimeSlotService{

  timeSlots: any[] = [];

  TimeSlotSuject = new Subject<any[]>();

  app!: any;
  filter_userid: string[] = [];

  emitTimeSlotSubject() {
    this.TimeSlotSuject.next(this.timeSlots);
  }

  constructor(private httpClient: HttpClient, private firestore: Firestore,private authService:AuthService) {
  }

  getNextDay(date:Date) {
    const next = new Date(date.getTime());
    next.setDate(date.getDate() + 1);

    return next;
  }


  async createTimeSlots(form: any) {
    if (this.authService.isAuth()) {
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
            temp.push({ userid: this.authService.user_data.user_id, date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'], customer: "", title: "" })
            console.log("After" + startDate + " " + startDate.getDay());
          }
  
          startDate = this.getNextDay(startDate);
        }  
      } else {
        temp.push({userid: this.authService.user_data.user_id, date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'],customer:"",title:"" })
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

  }

  arrayUniqueByKey(array: any[],key:any) {
   return  [...new Map(array.map(item =>
      [item[key], item])).values()];
  }

  async getTimeSlots(filter_type: string) {
    if (this.authService.isAuth()) {
      if (!this.filter_userid.includes(this.authService.user_data.user_id)) this.filter_userid.push(this.authService.user_data.user_id)
      console.log(this.filter_userid)
    const ref = await getDocs(collection(this.firestore, 'timeslots'))
    ref.forEach(doc => {
      this.timeSlots.push({
        id: doc.id, date: new Date(doc.data()['date']['seconds'] * 1000), time: doc.data()['time'], info: doc.data()['info'],
        color: '#0369a1', background : '#e0f2fe',userid: doc.data()['userid'],title:doc.data()['title'],customer:doc.data()['customer']})
    })
      
    //get users data and merge with timeslots
      let users_data = await this.authService.getUsers();
      if (users_data) {
        for (let i = 0; i < this.timeSlots.length; i++){
          for (let j = 0; j < users_data.length; j++){
            if (this.timeSlots[i].customer == users_data[j].uuid) {
              this.timeSlots[i].customer = users_data[j];
            }
          }
        }
        for (let i = 0; i < this.timeSlots.length; i++){
          for (let j = 0; j < users_data.length; j++){
            if (this.timeSlots[i].userid == users_data[j].uuid) {
              this.timeSlots[i].userid = users_data[j];
            }
          }
        }
      }

      console.log(this.timeSlots)

      if (filter_type != '') {
        return this.arrayUniqueByKey(this.timeSlots, "id").filter(d => d.info === filter_type)
          .filter(data => this.filter_userid.includes(data.customer.uuid) || this.filter_userid.includes(data.userid.uuid));
      } else {
        return this.arrayUniqueByKey(this.timeSlots, "id")
          .filter(data => this.filter_userid.includes(data.customer.uuid) || this.filter_userid.includes(data.userid.uuid));
      }

    } else {
      return [];
  }

  }

  async bookTimeSlot(app: any,title:string) {
    if (this.authService.isAuth()) {
      const timeslotRef = doc(this.firestore, 'timeslots', app.id)
      await updateDoc(timeslotRef, {
        customer: this.authService.user_data.user_id,
        info: "Pending",
        title: title
      }).then(() => {
        this.emitTimeSlotSubject();
      })
    } else {
      console.log("not logged")
    }
  }

  async validateTimeSlot(id: string) {
    if (this.authService.isAuth()) {
      const timeSlotRef = doc(this.firestore, 'timeslots', id)
      await updateDoc(timeSlotRef, {
        info:"Approved"
      }).then(() => {
        this.emitTimeSlotSubject();
      }).catch(err => console.log(err))
    } else {
      console.log("not logged");
    }
  }

  async deleteTimeSlot(id: string) {
    if (this.authService.isAuth()) {
      const ref = doc(this.firestore,'timeslots',id)
      await deleteDoc(ref).then(() => this.emitTimeSlotSubject()).catch(err => console.log(err))
    }
  }

  async cancelTimeSlot(id: string) {
    if (this.authService.isAuth()) {
      const timeSlotRef = doc(this.firestore, 'timeslots', id)
      if (this.authService.current_user.role == 'Entreprise') {
        await updateDoc(timeSlotRef, {
          info:"Cancelled"
        }).then(() => {
          this.emitTimeSlotSubject();
        }).catch(err => console.log(err))
      } else {
        await updateDoc(timeSlotRef, {
          info:"Available"
        }).then(() => {
          this.emitTimeSlotSubject();
        }).catch(err => console.log(err))
      }

    } else {
      console.log("not logged");
    }
  }

  }

