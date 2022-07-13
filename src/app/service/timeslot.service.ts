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

  message: any = {visible:false, message:'',type:""}

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

      if (startDate > endDate) {
        this.message = { visible: true, message: "start date can not be greater than end date !", type: "error" }
        return
      } 

      if (form['startTime'] >= form['endTime']) {
        this.message = { visible: true, message: "Start time must be greater than end time !", type: "error" }
        return
      }
  
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
            temp.push({ userid: this.authService.user_data.user_id, date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'], customer: "", title: "" })
          }
  
          startDate = this.getNextDay(startDate);
        }  
      } else {
        temp.push({userid: this.authService.user_data.user_id, date: startDate, info: "Available", time: form['startTime'] + "-" + form['endTime'],customer:"",title:"" })
      }
      
      try {
        if (temp.length != 0) {
          for (let timeslot of temp) {
            const docRef = await addDoc(collection(this.firestore, "timeslots"), timeslot).then(() => {
              this.message = { visible: true, message: "Timeslot(s) successfully created !", type: "success" }
              this.emitTimeSlotSubject()
            })
        }
        } else {
          this.message = { visible: true, message: "Select at least one day !", type: "error" }
        }
      } catch (e) {
        this.message = {visible:true, message:"Error while creating timeslot(s)",type:"error"}
      }
    }

  }

  arrayUniqueByKey(array: any[],key:any) {
   return  [...new Map(array.map(item =>
      [item[key], item])).values()];
  }

  async getTimeSlots(filter_type: string) {
    if (this.authService.isAuth()) {
      this.timeSlots = [];
      if (!this.filter_userid.includes(this.authService.user_data.user_id)) this.filter_userid.push(this.authService.user_data.user_id)
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

  async bookTimeSlot(app: any, title: string) {
    console.log(app)
    if (this.authService.isAuth()) {
      if (!title) {
        this.message = { visible: true, message: 'Title can not be empty !', type: "error" }
        return 
      }
      const timeslotRef = doc(this.firestore, 'timeslots', app.id)
      await updateDoc(timeslotRef, {
        customer: this.authService.user_data.user_id,
        info: "Pending",
        title: title
      }).then(() => {
        this.message = {visible:true, message:'The request has been sent !',type:"success"}
        this.emitTimeSlotSubject();
      }).catch(err => this.message = {visible:true, message:'Error while approved !',type:"error"})
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
        this.message = {visible:true, message:'Appointment approved !',type:"success"}
        this.emitTimeSlotSubject();
      }).catch(err => this.message = {visible:true, message:'Error while approved !',type:"error"})
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
        }).catch(err => this.message = { visible: true, message: "Error while cancelling", type: "error" })
      } else {
        await updateDoc(timeSlotRef, {
          info: "Available",
          customer:""
        }).then(() => {
          this.emitTimeSlotSubject();
        }).catch(err => this.message = { visible: true, message: "Error while cancelling", type: "error" })
      }

    } else {
      console.log("not logged");
    }
  }

  }

