import { TimeSlotService } from './service/timeslot.service';
import { AuthService } from './service/auth.service';
import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';
import { getFirestore } from "firebase/firestore";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  app!: any;

  constructor(private authService:AuthService,private timeSlotService: TimeSlotService){}

  ngOnInit(): void {

};

  title = 'temp';
}
