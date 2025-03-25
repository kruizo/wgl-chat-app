export interface Server {
  id: string;
  name: string;
  icon: string;
  color: string;
  userCount: number;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  avatar?: string;
}
