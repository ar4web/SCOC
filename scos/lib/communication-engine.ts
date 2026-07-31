let messages: Message[] = [];
let announcements: Announcement[] = [];

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  author: string;
  createdAt: string;
  priority: 'normal' | 'high' | 'urgent';
}

export function getMessages(): Message[] {
  return messages;
}

export function sendMessage(senderId: string, senderName: string, content: string): Message {
  const msg: Message = {
    id: Math.random().toString(36).substring(2, 10),
    senderId,
    senderName,
    content,
    timestamp: new Date().toISOString(),
  };
  messages.push(msg);
  return msg;
}

export function getAnnouncements(): Announcement[] {
  return announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
  const ann: Announcement = {
    ...data,
    id: Math.random().toString(36).substring(2, 10),
    createdAt: new Date().toISOString(),
  };
  announcements.push(ann);
  return ann;
}
