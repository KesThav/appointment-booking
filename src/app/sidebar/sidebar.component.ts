import { AuthService } from './../service/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidebarService } from './../service/sidebar.service';
import { Component,  EventEmitter,  Input,  OnInit, Output } from '@angular/core';
import { filter, map } from 'rxjs';
import {mergeMap} from 'rxjs/operators'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  visible: boolean;
  @Output() setVisibility = new EventEmitter<boolean>();


  constructor(private router: Router, private activatedRoute: ActivatedRoute,private authService:AuthService,private sidebarService:SidebarService) {
    this.visible = false; // set toolbar visible to false
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
      )
      .pipe(
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
      )
      .subscribe(event => {
        this.showSidebar(event['sidebar']); // show the toolbar?
        this.sidebarService.visible = this.visible;
      });
  }


  showSidebar(event:any) {
    if (event === false) {
      this.visible = false;
    } else if (event === true) {
      this.visible = true;
    } else {
      this.visible = this.visible;
    }
  }

  signOut() {
    this.authService.signOut();
  }

}
