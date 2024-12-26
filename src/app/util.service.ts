import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private db: AngularFireDatabase,) { }

  hideCharacters(str: string, visibleCount = 3): string {
    if (str.length <= visibleCount) {
      return str; // Return as-is if shorter than visibleCount
    }
    const visiblePart = str.slice(0, visibleCount); // Visible portion
    const hiddenPart = '*'.repeat(str.length - visibleCount); // Hidden portion
    return visiblePart + hiddenPart;
  }

  // seedData() {
  //   const seedClients = this.generateSampleClients(500); // Generate 10 sample records
  //
  //   seedClients.forEach((client) => {
  //     this.db.list('clients').push(client)
  //       .then(() => console.log(`Seeded: ${client.user_firstname} ${client.user_lastname}`))
  //       .catch((error) => console.error('Error seeding data:', error));
  //   });
  //
  //   console.log('Seeding completed.');
  // }
  //
  // /**
  //  * Generates an array of sample Perclient objects
  //  * @param count Number of sample clients to generate
  //  */
  // private generateSampleClients(count: number): any[] {
  //   const sampleClients = [];
  //   for (let i = 1; i <= count; i++) {
  //     sampleClients.push({
  //       in1: i,
  //       user_firstname: `Firstname${i}`,
  //       user_lastname: `Lastname${i}`,
  //       user_birthdate: `1990-0${(i % 9) + 1}-0${(i % 28) + 1}`, // Randomized birthdates
  //       user_mobile: `123456789${i}`,
  //       latest_ride_id: `ride_${i}`,
  //       latest_ride_history: [
  //         { rideId: `ride_${i}_1`, date: '2024-01-01', destination: 'Place A' },
  //         { rideId: `ride_${i}_2`, date: '2024-02-01', destination: 'Place B' },
  //       ],
  //     });
  //   }
  //   return sampleClients;
  // }
}
