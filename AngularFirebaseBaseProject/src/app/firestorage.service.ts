import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  path = '';
  task: AngularFireUploadTask = null;
  uploadProgress = new Observable();
  downloadURL = of('');


  constructor(public firestorage: AngularFireStorage,
              public auth: AuthService) { }

  upload(event) {
    console.log('event: ', event);

    let ext = '.jpg';
    if (event.target.files[0].type === 'image/png'){
      ext = '.png';
    }

    const path = this.path + this.auth.authUser.uid + ext;
    const ref = this.firestorage.ref(path);
    this.task = this.firestorage.upload(path, event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe( finalize( () => {
      this.downloadURL = ref.getDownloadURL();
      console.log('this.downloadURL: ', this.downloadURL);
    })).subscribe();



  }

}
