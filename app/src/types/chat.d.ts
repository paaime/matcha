export interface IMessage {
  id: number;
  match_id: number;
  user_id: number;
  username: string;
  pictures: string;
  content: string;
  created_at: string;
}

export interface IPreviewChat {
  id: number;
  username: string;
  firstName: string;
  isOnline: boolean;
  pictures: string;
  lastMessage: string;
  lastMessageDate: string;
}

export interface IChat {
  id: number;
  username: string;
  firstName: string;
  messages: IMessage[];
}
