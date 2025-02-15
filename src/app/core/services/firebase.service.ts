import { UserService } from './user.service';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
  deleteObject,
} from 'firebase/storage';
import { Observable } from 'rxjs';
import {
  Firestore,
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  CacheFieldEnum,
  FirestoreCollectionEnum,
} from '../../shared/enums/firebase.enum';

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
  private firestoreDB!: Firestore;

  constructor(private UserService: UserService) {}

  init() {
    this.app = initializeApp(this.firebaseConfig);
    this.realTimeChatDB = getDatabase(this.app, environment.chatDB);
    this.realTimeNotiDB = getDatabase(this.app, environment.notiDB);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
    this.firestoreDB = getFirestore(this.app);
  }

  destroy() {
    this.app.delete();
  }

  // Auth
  signInWithPopupGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  getUserMetaData() {
    const userId = this.UserService.user$.value?.id || '';
    const metadata = {
      customMetadata: {
        userId: userId,
      },
    };

    return metadata;
  }

  // Storage
  uploadFile(filePath: string, file: File) {
    const metadata = this.getUserMetaData();

    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    // Observable for progress tracking
    const progress$ = new Observable<number>((observer) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => observer.error(error),
        () => observer.complete()
      );
    });

    // Observable for download URL
    const downloadURL$ = new Observable<string>((observer) => {
      uploadTask.then(() => {
        getDownloadURL(fileRef).then((url) => {
          observer.next(url);
          observer.complete();
        });
      });
    });

    return { progress$, downloadURL$ };
  }

  deleteFile(fileUrl: string) {
    const meta = this.getUserMetaData();
    const filePath = decodeURIComponent(fileUrl.split('/o/')[1].split('?')[0]);
    const fileRef = ref(this.storage, filePath);

    return deleteObject(fileRef);
  }

  addCacheImage(url: string) {
    this.addCache(CacheFieldEnum.IMAGE_URL, url);
  }

  async removeCachedImage(): Promise<void> {
    const userId = this.UserService.user$.value?.id;
    if (!userId) return;
    
    try {
      const res = await this.getDocument(
        FirestoreCollectionEnum.CACHE_COL,
        userId
        );

      const imgUrls = (res as any)?.imageUrl || [];

      if (imgUrls.length === 0) {
        // console.log('No images to delete.');
        return;
      }

      const deleteStack = imgUrls.map((url: string) => this.deleteFile(url));

      await Promise.all(deleteStack);
      this.clearCacheField(CacheFieldEnum.IMAGE_URL);
      // console.log('All cached images deleted successfully.');
    } catch (error) {
      // console.error('Error deleting cached images:', error);
    }
  }

  // Firestore
  async getAllData(collectionName: FirestoreCollectionEnum) {
    const colRef = collection(this.firestoreDB, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getDocument(
    collectionName: FirestoreCollectionEnum,
    docId: string | null
  ) {
    if (!docId) return;

    const docRef = doc(this.firestoreDB, collectionName, docId);

    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  async updateData(
    collectionName: FirestoreCollectionEnum,
    docId: string,
    data: Object
  ) {
    const docRef = doc(this.firestoreDB, collectionName, docId);
    return await setDoc(docRef, data, { merge: true });
  }

  async deleteData(collectionName: FirestoreCollectionEnum, docId: string) {
    const docRef = doc(this.firestoreDB, collectionName, docId);
    return await deleteDoc(docRef);
  }

  async addCache(field: CacheFieldEnum, value: any) {
    const collectionName = FirestoreCollectionEnum.CACHE_COL;
    const docId = this.UserService.user$.value?.id || '';

    if (docId.trim().length === 0) return;

    try {
      await this.updateData(collectionName, docId, {
        [field]: arrayUnion(value),
      });
      console.log('URL added successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  async clearCacheField(field: CacheFieldEnum) {
    const collectionName = FirestoreCollectionEnum.CACHE_COL;
    const docId = this.UserService.user$.value?.id || '';

    if (docId.trim().length === 0) return;

    const docRef = doc(this.firestoreDB, collectionName, docId);

    try {
      await updateDoc(docRef, {
        [field]: [],
      });
      console.log('Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}
