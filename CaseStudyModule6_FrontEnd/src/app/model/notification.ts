import {User} from "./user";

export interface Notification {
  id?: number;
  title?: string;
  content?: string;
  idBoard?: number;
  url?: string;
  status?: boolean;
  receiver?: User[]
}
