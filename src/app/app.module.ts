import { SidebarService } from './service/sidebar.service';
import { AuthGuard } from './service/authguard.service';
import {TimeSlotService } from './service/timeslot.service';
import { AppointmentService } from './service/appointment.service';
import { AuthService } from './service/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { BoardComponent } from './board/board.component';
import { Routes,RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarWeekComponent } from './calendar-week/calendar-week.component';
import {HttpClientModule} from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreateTimeSlotsComponent } from './create-time-slots/create-time-slots.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {MatIconModule} from '@angular/material/icon';
import { AppointementComponent } from './appointment/appointment.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';


const appRoutes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full', data: {sidebar : false} },
  { path: 'signup', component: SignupComponent, data: { sidebar: false } },
  { path: 'login', component: LoginComponent, data: {sidebar : false}  },
  { path: "calendar", canActivate: [AuthGuard], component: CalendarComponent , data: {sidebar : true} },
  { path: "appointments", canActivate: [AuthGuard], component: AppointementComponent , data: {sidebar : true} },
  { path: "profile", canActivate:[AuthGuard], component:ProfileComponent, data: {sidebar : true} }
]

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    BoardComponent,
    CalendarComponent,
    CalendarWeekComponent,
    SidebarComponent,
    CreateTimeSlotsComponent,
    AppointementComponent,
    ProfileComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    MatIconModule
  ],
  providers: [AuthService,AppointmentService,TimeSlotService,AuthGuard,SidebarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
