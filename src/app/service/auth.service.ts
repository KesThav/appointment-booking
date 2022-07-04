import { last, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import * as auth from 'firebase/auth'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import jwt_decode from 'jwt-decode';


@Injectable()
export class AuthService {
  
  constructor(private router:Router,private httpClient:HttpClient,private firestore:Firestore){}

  tokenid: any = null || localStorage.getItem('tokenid');

  auth: boolean = false;

  isAuth = () => {
    return this.tokenid != null; 
  }

  users!: any[];

  userid: any;

  app: any = null;


  async createUser(email: string, firstName: string, lastName: string, role: string,tokenid:'string') {
    let decode_token:any = jwt_decode(tokenid);
    this.userid = decode_token.user_id;
    const docRef = await addDoc(collection(this.firestore, "users"), { uuid: this.userid, email: email, firstName: firstName, lastName: lastName, role: role })
      .then(() => console.log("user created !"))

  }

  getUsers() {
    this.httpClient.get(this.firestore.app.options.databaseURL + "/users.json").subscribe(res => {
      this.users.push(res);
      console.log(res);
    })
  }

  signin(email: string, password: string,firstName:string, lastName:string, role: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password).then(async res => {
      this.tokenid = await res.user.getIdToken();
      localStorage.setItem('tokenid',this.tokenid)
    }).then(() => this.createUser(email, firstName,lastName,role,this.tokenid))
      .then( () =>      this.router.navigate(['board']))
  }

}

