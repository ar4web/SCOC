'use client';

import React from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { communicationService, Message } from '@/modules/communication/service';
import { t, formatDate } from '@/lib/utils';
import { MessageSquare, Send, Megaphone } from 'lucide-react';

export default function CommunicationPage() {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [tab, setTab] = React.useState<'chat' | 'announcements'>('chat');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    loadMessages();
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const res = await communicationService.getMessages();
    if (res.success && res.data) setMessages(res.data.data);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    await communicationService.sendMessage(user.id, user.name, newMessage);
    setNewMessage('');
    loadMessages();
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('Communication', 'التواصل', language)}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('Internal messaging and announcements', 'الرسائل الداخلية والإعلانات', language)}
        </p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab('chat')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="h-4 w-4 inline mr-1" />
          {t('Chat', 'الدردشة', language)}
        </button>
      </div>

      {tab === 'chat' && (
        <Card>
          <CardBody className="p-0">
            <div className="h-[400px] overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">
                    {t('No messages yet. Send a message!', 'لا توجد رسائل بعد. أرسل رسالة!', language)}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl ${
                        msg.senderId === user?.id
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      {msg.senderId !== user?.id && (
                        <p className="text-xs font-medium mb-1 opacity-70">{msg.senderName}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('Type a message...', 'اكتب رسالة...', language)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleSend} loading={sending} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
