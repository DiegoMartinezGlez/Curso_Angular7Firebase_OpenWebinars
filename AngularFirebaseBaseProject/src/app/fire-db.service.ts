import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FireDbService {

  constructor(private db: AngularFireDatabase) { }
   
  updateUserData(user: any) {
    console.log('user: ', user);
    const path = 'users/'+user.uid;
    const u = {
      email: user.email
    }
    this.db.object(path).update(u)
    .catch(error => console.log(error));
  }

  getUsers() {
    const path = 'users/';
    // return this.db.list(path).valueChanges();
    return this.db.list(path).snapshotChanges();
  }

  removeUser(userUid) {
    const path = 'users/' + userUid;
    return this.db.object(path).remove();
  }
 
}
