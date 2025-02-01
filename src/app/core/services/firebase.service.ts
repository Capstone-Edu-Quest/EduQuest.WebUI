import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseConfig = environment.firebaseConfig;
  private app: any = null;
  private realTimeChatDB!: Database;
  private realTimeNotiDB!: Database;
  private auth!: Auth;
  private storage!: any;

  constructor() {}

  init() {
    this.app = initializeApp(this.firebaseConfig);
    this.realTimeChatDB = getDatabase(this.app, environment.chatDB);
    this.realTimeNotiDB = getDatabase(this.app, environment.notiDB);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
  }

  signInWithPopupGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
}
