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
import { AppointmentComponent } from './appointment/appointment.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreateTimeSlotsComponent } from './create-time-slots/create-time-slots.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'signup', component: SignupComponent },
  {path: "board", component:BoardComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    BoardComponent,
    CalendarComponent,
    CalendarWeekComponent,
    AppointmentComponent,
    SidebarComponent,
    CreateTimeSlotsComponent,
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
    provideFirestore(() => getFirestore())
  ],
  providers: [AuthService,AppointmentService,TimeSlotService],
  bootstrap: [AppComponent]
})
export class AppModule { }
