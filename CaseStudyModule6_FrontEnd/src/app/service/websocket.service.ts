import { Injectable } from '@angular/core';
import {Stomp} from "@stomp/stompjs";
import {Notification} from "../model/notification";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  disabled = true;
  private stompClient: any;

  constructor() {
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;
  }

  connect(idBoard: number | undefined) {
    // đường dẫn đến server
    const socket = new WebSocket('ws://localhost:8080/gkz-stomp-endpoint/websocket');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      // là chờ xèm thằng server gửi về.
      _this.stompClient.subscribe('/topic/public'+idBoard, function (notification: any) {

      });

    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName(notification: Notification) {
    this.stompClient.send(
      '/gkz/notification',
      {},
      // Dữ liệu được gửi đi
      JSON.stringify(notification)
    );
  }
}
