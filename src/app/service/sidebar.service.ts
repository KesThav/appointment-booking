import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class SidebarService{

  visibleSubject = new Subject<boolean>();
  visible: boolean = false;

  emitVisibility() {
    this.visibleSubject.next(this.visible);
  }
}