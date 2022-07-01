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
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
  ],
  providers: [AuthService,AppointmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
