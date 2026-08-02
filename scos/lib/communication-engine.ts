let messages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    senderName: 'System',
    content: 'Welcome to the SCOS Communication Center!',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
let announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Company Holiday Update',
    titleAr: 'تحديث الإجازة الرسمية',
    content: 'The company will observe the upcoming Saudi National Day as an official holiday.',
    contentAr: 'ستحتفل الشركة باليوم الوطني السعودي القادم كإجازة رسمية.',
    author: 'HR Department',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    priority: 'high',
  },
  {
    id: 'ann-2',
    title: 'New Payroll Schedule',
    titleAr: 'جدول الرواتب الجديد',
    content: 'Monthly payroll will now be processed on the 25th of each month.',
    contentAr: 'سيتم الآن معالجة الرواتب الشهرية في اليوم 25 من كل شهر.',
    author: 'Finance Department',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    priority: 'normal',
  },
];

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
