import { last, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import * as auth from 'firebase/auth'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import jwt_decode from 'jwt-decode';


@Injectable()
export class AuthService {
  
  constructor(private router:Router,private httpClient:HttpClient,private firestore:Firestore){}

  user_data: any;
  
  tokenid: any;

  isAuth = () => {
    let tokenid = localStorage.getItem('tokenid');
    if (tokenid) {
      //improve this
      this.user_data = jwt_decode(tokenid);
      return true
    } else {
      return false;
    }
  }

  users!: any[];


  async createUser(email: string, firstName: string, lastName: string, role: string) {
    if (this.isAuth()) {
      if (this.user_data) {
        console.log(this.user_data)
              const docRef = await addDoc(collection(this.firestore, "users"), { uuid: this.user_data.user_id, email: email, firstName: firstName, lastName: lastName, role: role })
      .then(() => console.log("user created !"))
      }

    }
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
      localStorage.setItem('tokenid', this.tokenid)
      this.isAuth();
    }).then(() => this.createUser(email, firstName,lastName,role))
      .then(() => this.router.navigate(['calendar']))
    .catch(err => console.log(err))
  }

  login(email: string, password: string) {
    console.log(email)
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).then(async res => {
      this.tokenid = await res.user.getIdToken();
      localStorage.setItem('tokenid', this.tokenid)
      this.isAuth();
    }).then(() => this.router.navigate(['calendar']))
    .catch(err => console.log(err))
  }

  signOut() {
    this.router.navigate(['/']);
    localStorage.removeItem('tokenid');
  }


  setShow() {
    if (this.router.url.includes('signup') || this.router.url === '') {
      console.log(this.router.url.includes(''))
      return false
    } else {
      return true
    }
  }
  
}

