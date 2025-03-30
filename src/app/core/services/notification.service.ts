import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INotification } from '../../shared/interfaces/others.interfaces';
import { UserService } from './user.service';
import { Database, ref, onValue, off, DatabaseReference } from 'firebase/database';
import { FirebaseService } from './firebase.service';
import { LoadingService } from './loading.service';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  notification$: BehaviorSubject<INotification[]> = new BehaviorSubject<
    INotification[]
  >([]);

  private realTimeNotificationDB!: Database;
  private notificationRefs: DatabaseReference[] = [];

  constructor(private user: UserService, private firebase: FirebaseService, private loading: LoadingService) {}

  initNotifications() {
    if (!this.user.user$.value) {
      return;
    }

    const userId = this.user.user$.value.id;
    this.realTimeNotificationDB = this.firebase.getRealtimeNotiDB();

    if (!this.realTimeNotificationDB) {
      console.error('Firebase Realtime DB is not initialized');
      return;
    }

    this.notificationRefs.forEach((ref) => {
      off(ref);
    });

    const notificationsRef = ref(this.realTimeNotificationDB, `notifications/${userId}`);
    this.notificationRefs.push(notificationsRef);
    
    this.loading.addLoading();

    onValue(notificationsRef, (snapshot) => {
      const notifications = snapshot.val();

      const notificationsList: INotification[] = [];
      Object.keys(notifications).forEach((key) => {
        notificationsList.push({
          id: key,
          ...notifications[key]
        })
      })

      this.notification$.next(notificationsList);
      this.loading.removeLoading();
    }, (error) => {
      console.error('Error fetching real-time notifications:', error);
      this.loading.removeLoading();
    });
    
  }

  destroyNotification() {
    this.notificationRefs.forEach((ref) => {
      off(ref);
    });
    this.notification$.next([]);
  }
}
