import { Component, OnInit, inject} from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'; // Import the service

export interface Vehicle {
  name: string;
  type: string;
  model: string;
  year: number;
}

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  inputValue1: string = '';
  inputValue2: string = '';
  inputValue3: string = '';
  inputValue4: number = new Date().getFullYear();

  firestore = inject(Firestore);

  async addVehicle() {
    try {
      const vehicle: Vehicle = {
        name: this.inputValue1,
        type: this.inputValue2,
        model: this.inputValue3,
        year: this.inputValue4
      };

      await addDoc(collection(this.firestore, 'vehicles'), vehicle);

      this.inputValue1 = '';
      this.inputValue2 = '';
      this.inputValue3 = '';
      this.inputValue4 = new Date().getFullYear();

      
    } catch (error) {
      console.error('Error adding data:', error);
    } 
  }

}
