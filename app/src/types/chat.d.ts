export interface IMessage {
  id: number;
  match_id: number;
  user_id: number;
  pictures: string;
  content: string;
  type: string;
  created_at: string;
}

export interface IPreviewChat {
  id: number;
  username: string;
  pictures: string;
  lastMessage: string;
  lastMessageDate: string;
}

export interface IChat {
  id: number;
  username: string;
  messages: IMessage[];
}
