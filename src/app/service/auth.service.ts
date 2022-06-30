import { Subject } from "rxjs";
import { initializeApp } from "firebase/app";
import { Injectable } from "@angular/core";
import * as auth from 'firebase/auth'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
  
  constructor(private router:Router){}

  tokenid: any = null || localStorage.getItem('tokenid');

  auth: boolean = false;

  isAuth = () => {
    return this.tokenid != null; 
  }

  app: any = null;

  firebaseConnexion() {
    const firebaseConfig = {
      apiKey: "AIzaSyD5OY5h2Mbk4Ev-Mh8DCMcLrH_BAugEk_I",
      authDomain: "appointment-management-8d084.firebaseapp.com",
      databaseURL: "https://appointment-management-8d084-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "appointment-management-8d084",
      torageBucket: "appointment-management-8d084.appspot.com",
      messagingSenderId: "282606080807",
      appId: "1:282606080807:web:16375a62357517574b4f02"
};

    this.app = initializeApp(firebaseConfig);
  }

  createUser(name:string,role:string) {
    
  }

  signin(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password).then(async res => {
      this.tokenid = await res.user.getIdToken();
      localStorage.setItem('tokenid',this.tokenid)
      this.router.navigate(['board'])
    })
  }

}

