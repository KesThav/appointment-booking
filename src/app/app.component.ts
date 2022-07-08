import { NavigationEnd, Router } from '@angular/router';
import { TimeSlotService } from './service/timeslot.service';
import { AuthService } from './service/auth.service';
import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';
import { getFirestore } from "firebase/firestore";
import {Location} from '@angular/common'
import { filter } from 'rxjs';
import { SidebarService } from './service/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  visible: boolean = false;

  constructor(private authService:AuthService,private sidebarService: SidebarService) {
  }

  ngOnInit(): void {
    this.visible = this.sidebarService.visible
    console.log(this.visible)
  }





  setShow() {
    return this.authService.setShow();
  }

  
}
