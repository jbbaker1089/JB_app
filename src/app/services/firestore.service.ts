import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface Vehicle {
  name: string;
  type: string;
  model: string;
  year: number;
}

@Injectable({
  providedIn: 'root', // Ensures the service is available throughout the app
})
export class FirestoreService {
  private firestore = inject(AngularFirestore); // Use `inject()` here instead of constructor injection

  // Method to add a new vehicle to Firestore
  addVehicle(vehicle: Vehicle) {
    const id = this.firestore.createId(); // Generate a unique document ID
    return this.firestore
      .collection('vehicles') // Reference to 'vehicles' collection
      .doc(id) // Set document ID
      .set(vehicle); // Store vehicle data in Firestore
  }

  // Method to get all vehicles from Firestore
  getVehicles(): Observable<Vehicle[]> {
    return this.firestore.collection<Vehicle>('vehicles').valueChanges();
  }
}

