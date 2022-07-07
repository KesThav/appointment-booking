import { Component,  EventEmitter,  Input,  OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() setView!: ((arg: number) => void) ;

  constructor() { }

  ngOnInit(): void {
  }


}
