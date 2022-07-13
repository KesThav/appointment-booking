import { last, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import * as auth from 'firebase/auth'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import jwt_decode from 'jwt-decode';
import { collection, addDoc, Firestore, getDocs,where,query } from '@angular/fire/firestore';
import { doc, updateDoc, increment } from "firebase/firestore";


@Injectable()
export class AuthService {
  
  constructor(private router:Router,private httpClient:HttpClient,private firestore:Firestore){}

  user_data: any;

  current_user!: any;
  
  tokenid: any;

  error_message:boolean = false;

  isAuth = () => {
    let tokenid = localStorage.getItem('tokenid');
    if (tokenid) {
      //improve this
      this.user_data = jwt_decode(tokenid);
      if (this.user_data) {
        this.getCurrentUser();
      }      
      return true
    } else {
      return false;
    }
  }

  userSubject = new Subject<any[]>();

  users: any[] = [];

  emitUsers() {
    this.userSubject.next(this.users);
  }


  async createUser(email: string, firstName: string, lastName: string, role: string) {
    if (this.isAuth()) {
      if (this.user_data) {
              const docRef = await addDoc(collection(this.firestore, "users"), { uuid: this.user_data.user_id, email: email, firstName: firstName, lastName: lastName, role: role })
      .then(() => console.log("user created !"))
      }

    }
  }

  arrayUniqueByKey(array: any[],key:any) {
    return  [...new Map(array.map(item =>
       [item[key], item])).values()];
   }

  async getUsers(role?:string) {
    const ref = await getDocs(collection(this.firestore, 'users'));
    ref.forEach(doc => {
      this.users.push({
        id: doc.id, email: doc.data()['email'], firstName: doc.data()['firstName'],
        lastName: doc.data()['lastName'], role: doc.data()['role'], uuid: doc.data()['uuid']
      })
      return this.users
    })

    if (role) {
      return this.arrayUniqueByKey(this.users, "id").filter(data => data.role == role)
    } else {
      return this.arrayUniqueByKey(this.users, "id")
    }
  }

  async getCurrentUser() {
    const q = query(collection(this.firestore, 'users'), where("uuid", "==", this.user_data.user_id));
    const ref = await getDocs(q)
    ref.forEach(doc => {
      this.current_user = { email: doc.data()['email'], firstName : doc.data()['firstName'], lastName:doc.data()['lastName'], role: doc.data()['role'], uuid: doc.data()['uuid'] }
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
      this.getCurrentUser();
    }).then(() => this.router.navigate(['calendar']))
      .catch(err => this.error_message = true)
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

