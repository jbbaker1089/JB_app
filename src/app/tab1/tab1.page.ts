import { Component, inject } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface Lap {
  time: string;       // Time in seconds or milliseconds
  vehicle: string;    // Vehicle name or ID
  track: string;      // Track name or ID
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  laps: Lap[] = [];

  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    this.loadLaps();
  }

  loadLaps() {
    const lapsCollection = collection(this.firestore, 'lap-times') as CollectionReference<Lap>;
    const laps$: Observable<Lap[]> = collectionData(lapsCollection) as Observable<Lap[]>;

    laps$.subscribe((data: Lap[]) => {
      this.laps = data;
      console.log('Fetched laps:', data);
    });
  }

  // 🔥 Logout method
  async logout() {
    try {
      await signOut(this.auth);
      // Navigate back to login page
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (err: any) {
      console.error('Logout failed:', err);
      alert(err.message || 'Logout failed');
    }
  }
}

