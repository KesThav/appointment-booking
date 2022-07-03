import { TimeSlotService } from './../service/timeslot.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-time-slots',
  templateUrl: './create-time-slots.component.html',
  styleUrls: ['./create-time-slots.component.css']
})
export class CreateTimeSlotsComponent implements OnInit {

  open: boolean = false;

  timeSlotForm!: FormGroup;

  constructor(private formBuilder:FormBuilder, private timeSlotService:TimeSlotService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.timeSlotForm = this.formBuilder.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      recurrent: [false],
      endDate: ['', Validators.required],
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false],
      
    })
  }

  setOpen() {
    this.open = true;
  }

  setClose() {
    this.open = false;
  }

  submitForm() {
    this.timeSlotService.createTimeSlots(this.timeSlotForm.value)
  }

  checkIsTrue() {
    let form = this.timeSlotForm.value;
    return form['recurrent'] == true
  }



}
