import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  IChatConversation,
  IChatMessage,
  IParticipant,
} from '../../shared/interfaces/others.interfaces';
import {
  Database,
  get,
  ref,
  onValue,
  DatabaseReference,
  off,
  push,
  update,
} from 'firebase/database';
import { FirebaseService } from './firebase.service';
import { UserService } from './user.service';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Firebase structure
  // /conversations
  //    /conv-001
  //       id: conv-001
  //       participants:
  //          user-123: lastSeen
  //          user-456: lastSeen
  //       createdAt: 2025-02-02T08:00:00Z
  //       lastMessage:
  //          senderId: user-456
  //          time: 2025-02-02T08:09:15Z
  //          content: Need help? I ran into something similar last week.
  //    /conv-002
  //       id: conv-001
  //       participants:
  //          user-123: lastSeen
  //          user-456: lastSeen
  //       createdAt: 2025-02-02T08:00:00Z
  //       lastMessage:
  //          senderId: user-456
  //          time: 2025-02-02T08:09:15Z
  //          content: Need help? I ran into something similar last week.
  // /messages
  //   /conv-001
  //     /msg-001
  //       id: msg-001
  //       senderId: user-123
  //       time: 2025-02-02T08:05:00Z
  //       content: Hey, how are you?
  //     /msg-002
  //       id: msg-002
  //       senderId: user-123
  //       time: 2025-02-02T08:05:00Z
  //       content: Hey, how are you?

  conversations$: BehaviorSubject<IChatConversation[]> = new BehaviorSubject<
    IChatConversation[]
  >([]);
  messages$: BehaviorSubject<IChatMessage[]> = new BehaviorSubject<
    IChatMessage[]
  >([]);

  conversationRefs: DatabaseReference[] = [];
  messageRefs: DatabaseReference[] = [];

  private realTimeChatDB!: Database;

  constructor(
    private firebaseService: FirebaseService,
    private user: UserService,
    private loading: LoadingService,
    private router: Router
  ) {}

  initChat() {
    if (!this.user.user$.value) {
      return;
    }

    const userId = this.user.user$.value.id; // Replace with dynamic user ID if needed
    this.realTimeChatDB = this.firebaseService.getRealtimeChatDB();

    if (!this.realTimeChatDB) {
      console.error('Firebase Realtime DB is not initialized');
      return;
    }

    this.loading.addLoading();

    this.conversationRefs.forEach((ref) => {
      off(ref);
    });
    const conversationsRef = ref(this.realTimeChatDB, 'conversations');
    this.conversationRefs.push(conversationsRef);

    // Set up real-time listener
    onValue(
      conversationsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          this.conversations$.next([]); // Clear if no data exists
          return;
        }

        const conversations = snapshot.val();
        const userConversations: IChatConversation[] = [];

        console.log(conversations)

        Object.keys(conversations).forEach((key) => {
          const participants = Object.keys(conversations[key].participants);
          if (participants.includes(userId)) {
            const conv = { ...conversations[key], id: key, isMeSeen: false };
            userConversations.push({
              ...conv,
              isMeSeen: this.checkIsSeen(conv),
            });
          }
        });

        console.log(userConversations)

        this.conversations$.next(userConversations); // Update state reactively
        this.loading.removeLoading();
      },
      (error) => {
        console.error('Error fetching real-time conversations:', error);
        this.loading.removeLoading();
      }
    );
  }

  initMessages(conversationId: string) {
    if (!this.user.user$.value) {
      return;
    }

    this.realTimeChatDB = this.firebaseService.getRealtimeChatDB();

    if (!this.realTimeChatDB) {
      console.error('Firebase Realtime DB is not initialized');
      return;
    }

    this.loading.addLoading();
    this.messageRefs.forEach((ref) => {
      off(ref);
    });

    // Set seen time
    const lastSeenPath = `conversations/${conversationId}/participants/${this.user.user$.value?.id}/lastSeen`;
    const updates: any = {};
    updates[lastSeenPath] = new Date().toISOString();

    update(ref(this.realTimeChatDB), updates)
      .then(() => console.log('Last seen updated'))
      .catch((error) => console.error('Error updating last seen:', error));

    // Get messages
    const messagesRef = ref(this.realTimeChatDB, `messages/${conversationId}`);
    this.messageRefs.push(messagesRef);

    // Set up real-time listener
    onValue(
      messagesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          this.messages$.next([]); // Clear messages if none exist
          this.loading.removeLoading();
          return;
        }

        const messagesData = snapshot.val();
        const messagesList = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));

        // Sort messages by timestamp (optional, if not sorted in Firebase)
        messagesList.sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

        this.messages$.next(messagesList); // Update messages in real-time
        this.loading.removeLoading();
      },
      (error) => {
        console.error('Error fetching real-time messages:', error);
        this.loading.removeLoading();
      }
    );
  }

  addConversation(participants: IParticipant[]) {
    if (!this.realTimeChatDB) {
      console.error('Firebase Realtime DB is not initialized');
      return;
    }

    const conversationsRef = ref(this.realTimeChatDB, 'conversations');

    const participant: any = {};
    participants.forEach((p) => {
      participant[p.id] = {
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        lastSeen: new Date().toISOString(),
      };
    });

    const newConversation: IChatConversation = {
      participants: participant,
      createdAt: new Date().toISOString(),
      lastMessage: null, // No message initially
    };

    const newConvRef = push(conversationsRef, newConversation);
    this.router.navigate(['/chat', newConvRef.key]);
  }

  addMessage(conversationId: string, messageData: IChatMessage) {
    if (!this.realTimeChatDB) {
      console.error('Firebase Realtime DB is not initialized');
      return;
    }

    const messagesRef = ref(this.realTimeChatDB, `messages/${conversationId}`);
    const conversationRef = ref(
      this.realTimeChatDB,
      `conversations/${conversationId}`
    );

    // Push the new message
    push(messagesRef, messageData)
      .then(() => {
        // Update only the lastMessage field in the conversation
        update(conversationRef, { lastMessage: messageData })
          .then(() => console.log('Last message updated'))
          .catch((error) =>
            console.error('Error updating lastMessage:', error)
          );
      })
      .catch((error) => console.error('Error adding message:', error));
  }

  async handleSendMessage(
    participant1: IParticipant,
    participant2: IParticipant
  ) {
    const conversationId = await this.getConversationIdByUsers(
      participant1.id,
      participant2.id
    );

    if (!conversationId) {
      this.addConversation([participant1, participant2]);
      return;
    }
;
    this.router.navigate(['/chat', conversationId]);
  }

  getConversationIdByUsers(user1: string, user2: string) {
    const conversationsRef = ref(this.realTimeChatDB, 'conversations');

    return get(conversationsRef).then((snapshot) => {
      if (!snapshot.exists()) return;

      const conversationId = Object.keys(snapshot.val()).find(
        (id) =>
          snapshot.val()[id].participants?.[user1] &&
          snapshot.val()[id].participants?.[user2]
      );

      return conversationId;
    });
  }

  checkUserInConversation(conversationId: string, userId: string) {
    const conversationRef = ref(
      this.realTimeChatDB,
      `conversations/${conversationId}/participants`
    );

    return get(conversationRef).then((snapshot) => {
      return !!(snapshot.exists() && snapshot.val()?.[userId]);
    });
  }

  clearAllQueues() {
    this.conversationRefs.forEach((ref) => {
      off(ref);
    });
    this.messageRefs.forEach((ref) => {
      off(ref);
    });
  }

  checkIsSeen(conversation: IChatConversation) {
    const lastSeen =
      conversation.participants[this.user.user$.value?.id as string].lastSeen;
    const lastMessageTime = conversation.lastMessage?.time;

    if (!lastSeen || !lastMessageTime) return true;

    return (
      new Date(lastSeen).getTime() < new Date(lastMessageTime).getTime() &&
      conversation.lastMessage?.senderId !== this.user.user$.value?.id
    );
  }

  destroyChat() {
    this.clearAllQueues();
    this.conversations$.next([]);
    this.messages$.next([]);
  }
}
