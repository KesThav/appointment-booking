import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTimeSlotsComponent } from './create-time-slots.component';

describe('CreateTimeSlotsComponent', () => {
  let component: CreateTimeSlotsComponent;
  let fixture: ComponentFixture<CreateTimeSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTimeSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTimeSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
