import {Injectable} from '@angular/core';
import {Stomp} from "@stomp/stompjs";
import {Notification} from "../model/notification";
import {NotificationService} from "./notification/notification.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";

const API_URL = `${environment.api_url}`;


@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  disabled = false;
  private stompClient: any;

  constructor(private http: HttpClient) {
  }

  getAllIdBoardMember(idUser: number | undefined): Observable<number[]> {
    return this.http.get<number[]>(`${API_URL}workspaces/getAllBoardMember/`+ idUser);
  }

  setConnected(connected: boolean) {
    this.disabled = connected;
  }

  connect(idBoard: number | undefined, notificationService: NotificationService) {
    if (!this.disabled) {
      const socket = new WebSocket('ws://localhost:8080/gkz-stomp-endpoint/websocket');
      this.stompClient = Stomp.over(socket);
      const _this = this;
      this.stompClient.connect({}, function (frame: any) {
        _this.setConnected(true);

        // là chờ xèm thằng server gửi về.
        _this.stompClient.subscribe('/topic/public/' + idBoard, function (notification: any) {
          notificationService.unreadNotice++;
          notificationService.notification.unshift(JSON.parse(notification.body));
        });
      });
    }
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName(notification: Notification) {
    console.log("đã vào sendName");
    this.stompClient.send(
      '/gkz/notification',
      {},
      // Dữ liệu được gửi đi
      JSON.stringify(notification)
    );
  }
}
