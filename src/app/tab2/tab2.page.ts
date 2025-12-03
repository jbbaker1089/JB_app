import { Component, OnDestroy, inject } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Firestore, collectionData, collection, CollectionReference } from '@angular/fire/firestore';
import { Vehicle } from '../tab3/tab3.page';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnDestroy {

  tracking = false;
  lapStartTime: number = 0;
  lapTimeDisplay: string = "00:00:00";
  watchId: string | null = null;

  // Vehicles
  vehicles: Vehicle[] = [];
  selectedVehicleId: string | null = null;

  private firestore = inject(Firestore);

  constructor() {
    this.loadVehicles();
  }

  ngOnDestroy() {
    this.stopTracking();
  }

  loadVehicles() {
    const vehiclesCollection = collection(this.firestore, 'vehicles') as CollectionReference<Vehicle>;
    collectionData(vehiclesCollection).subscribe((data: Vehicle[]) => {
      this.vehicles = data;
      console.log('Loaded vehicles:', data);
    });
  }

  async startTracking() {
    // Check if a vehicle is selected
    if (!this.selectedVehicleId) {
      // Show an alert and exit early
      const alert = document.createElement('ion-alert');
      alert.header = 'No Vehicle Selected';
      alert.message = 'Please select a vehicle before starting the lap!';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
      return; // Stop here
    }

    // Start the timer
    this.tracking = true;
    this.lapStartTime = Date.now();
    this.updateLapTime();

    // Start watching position
    this.watchId = await Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        console.log("Geolocation error:", err);
        return;
      }
      console.log("Current position:", position?.coords);
    });
  }

  stopTracking() {
    this.tracking = false;

    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  resetLap() {
    this.stopTracking();
    this.lapTimeDisplay = "00:00:00";
    this.selectedVehicleId = null;
  }

  updateLapTime() {
    if (!this.tracking) return;

    const now = Date.now();
    const diff = now - this.lapStartTime;

    this.lapTimeDisplay = this.formatTime(diff);

    // Update every 100ms
    setTimeout(() => this.updateLapTime(), 100);
  }

  formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(n: number) {
    return n.toString().padStart(2, "0");
  }
}

