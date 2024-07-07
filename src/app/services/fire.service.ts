import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  constructor(private firestore: AngularFirestore) {}

  // Create a new room
  async createRoom(roomId: string, createdBy: string) {
    
    const data = this.firestore.collection('rooms').doc(roomId).set({ roomId, createdBy, reveal: false });
    this.addUserToRoom(roomId,createdBy,true);
    return ;
  }

  // Add or update user in a room
   addUserToRoom(roomId: string, userName: string, isOwner:boolean = false, reveal : boolean = false) : any {
    return this.firestore.collection(`rooms/${roomId}/users`).doc(userName).set({ userName, selectedCard: 0, isOwner:isOwner, reveal :reveal });
  }

  // Update user card selection
  setUserCardSelection(roomId: string, userName: string, cardValue: number) {
    return this.firestore.collection(`rooms/${roomId}/users`).doc(userName).update({ selectedCard: cardValue });
  }

  // Get all users in a room
  getUsersInRoom(roomId: string) {
    return this.firestore.collection(`rooms/${roomId}/users`).valueChanges();
  }

  // Get room reveal status
  getRoomRevealStatus(roomId: string) {
    return this.firestore.collection('rooms').doc(roomId).valueChanges();
  }

  // Set room reveal status
  setRoomRevealStatus(roomId: string, reveal: boolean) {
    return this.firestore.collection('rooms').doc(roomId).update({ reveal });
  }

  async resetSelectedCards(roomId: string): Promise<void> {
    const batch = this.firestore.firestore.batch();
    return this.firestore.collection(`rooms/${roomId}/users`).get().toPromise().then((data) => {
      data?.forEach(doc => {
        batch.update(doc.ref, { selectedCard: 0 });
      });
      const result = batch.commit();
      this.setBatchReveal(roomId,false);
      return result;
    });
  }

  async setBatchReveal(roomId: string, reveal : boolean): Promise<void> {
    const batch = this.firestore.firestore.batch();
    return this.firestore.collection(`rooms/${roomId}/users`).get().toPromise().then((data) => {
      data?.forEach(doc => {
        batch.update(doc.ref, { reveal: reveal });
      });
      return batch.commit();
    });
  }
}
