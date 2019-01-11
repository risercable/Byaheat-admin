import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from "firebase";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  chatsArray: PerChatx[];

  constructor(public db: AngularFireDatabase) {
    this.chatsArray = [];
    firebase.database().ref('drivers_chat').on('value', (snapshot) => {
      snapshot.forEach(item => {
        let json = item.val();
        json['$key'] = item.key;
        let tsss = item.child('timestamp').val();
        json['timestamp'] = new Date(tsss * 1000).toLocaleString();
        this.chatsArray.push(json as PerChatx);
      });
    });
  }

  ngOnInit() {
  }

  onsend(vm: string) {
    let tsmp = +new Date();

    firebase.database().ref('drivers_chat').push({
      createdByUser: "VCtfTcRuV8hRqZ6O7b5WUXNxNlF3",
      is: 'admin',
      name: "Admin Vanta",
      text: vm,
      timestamp: Math.floor(tsmp/1000)
    });
  }

}

export interface PerChatx {
  $key: string;
  is: string;
  createdByUser: string;
  name: string;
  text: string;
  timestamp: number;

}
