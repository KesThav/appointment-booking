
import {
  Component,

} from '@angular/core';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent{
 
  view: number = 0;
  
}
