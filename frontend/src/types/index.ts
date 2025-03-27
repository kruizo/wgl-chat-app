export interface Server {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  avatar?: string;
}
