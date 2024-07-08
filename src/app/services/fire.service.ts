import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  private secretKey = 'praveen';

  constructor(private firestore: AngularFirestore) {}

  // Encrypt data
  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  // Decrypt data
  private decryptData(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Create a new room
  async createRoom(roomId: string, createdBy: string) {
    await this.firestore.collection('rooms').doc(roomId).set({ roomId, createdBy, reveal: false });
    this.addUserToRoom(roomId, createdBy, true);
  }

  // Add or update user in a room
  addUserToRoom(roomId: string, userName: string, isOwner: boolean = false, reveal: boolean = false): any {
    return this.firestore.collection(`rooms/${roomId}/users`).doc(userName).set({
      userName,
      selectedCard: this.encryptData('0'),
      isOwner,
      reveal
    });
  }

  // Update user card selection
  setUserCardSelection(roomId: string, userName: string, cardValue: number) {
    const encryptedCardValue = this.encryptData(cardValue.toString());
    return this.firestore.collection(`rooms/${roomId}/users`).doc(userName).update({ selectedCard: encryptedCardValue });
  }

  // Get all users in a room
  getUsersInRoom(roomId: string) {
    return this.firestore.collection(`rooms/${roomId}/users`).valueChanges().pipe(
      map(users => users.map((user:any) => ({
        ...user,
        selectedCard: parseInt(this.decryptData(user?.selectedCard))
      })))
    );
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
        batch.update(doc.ref, {reveal: false, selectedCard: this.encryptData('0') });
      });
      const result = batch.commit();
      return result;
    });
  }

  async setBatchReveal(roomId: string, reveal: boolean): Promise<void> {
    const batch = this.firestore.firestore.batch();
    return this.firestore.collection(`rooms/${roomId}/users`).get().toPromise().then((data) => {
      data?.forEach(doc => {
        batch.update(doc.ref, { reveal });
      });
      return batch.commit();
    });
  }
}
