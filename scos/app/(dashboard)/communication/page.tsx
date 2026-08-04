'use client';

import React from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { communicationService, Message, Announcement } from '@/modules/communication/service';
import { t, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { MessageSquare, Send, Megaphone, AlertTriangle, Info, Plus, X } from 'lucide-react';

const priorityColors: Record<string, string> = {
  urgent: 'bg-error/10 text-error border-error/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  normal: 'bg-info/10 text-info border-info/20',
};

const priorityLabels: Record<string, { en: string; ar: string }> = {
  urgent: { en: 'Urgent', ar: 'عاجل' },
  high: { en: 'High', ar: 'عالي' },
  normal: { en: 'Normal', ar: 'عادي' },
};

export default function CommunicationPage() {
  const { language, dir } = useLanguageStore();
  const { user } = useAuthStore();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [tab, setTab] = React.useState<'chat' | 'announcements'>('chat');
  const [showDialog, setShowDialog] = React.useState(false);
  const [savingAnnouncement, setSavingAnnouncement] = React.useState(false);
  const [annForm, setAnnForm] = React.useState({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    priority: 'normal' as 'normal' | 'high' | 'urgent',
  });
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    loadMessages();
    loadAnnouncements();
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const res = await communicationService.getMessages();
    if (res.success && res.data) setMessages(res.data.data);
  };

  const loadAnnouncements = async () => {
    const res = await communicationService.getAnnouncements();
    if (res.success && res.data) setAnnouncements(res.data.data);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    await communicationService.sendMessage(user.id, user.name, newMessage);
    setNewMessage('');
    loadMessages();
    setSending(false);
  };

  const handleCreateAnnouncement = async () => {
    if (!annForm.title.trim() || !annForm.content.trim() || !user) return;
    setSavingAnnouncement(true);
    const res = await communicationService.createAnnouncement({
      title: annForm.title,
      titleAr: annForm.titleAr || annForm.title,
      content: annForm.content,
      contentAr: annForm.contentAr || annForm.content,
      author: user.name,
      priority: annForm.priority,
    });
    setSavingAnnouncement(false);
    if (res.success) {
      addToast({
        type: 'success',
        title: t('Announcement published', 'تم نشر الإعلان', language),
      });
      setShowDialog(false);
      setAnnForm({ title: '', titleAr: '', content: '', contentAr: '', priority: 'normal' });
      loadAnnouncements();
    } else {
      addToast({ type: 'error', title: res.error || t('Failed to publish announcement', 'فشل في نشر الإعلان', language) });
    }
  };

  return (
    <div className="space-y-6" dir={dir}>
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
        <button
          onClick={() => setTab('announcements')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'announcements' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Megaphone className="h-4 w-4 inline mr-1" />
          {t('Announcements', 'الإعلانات', language)}
        </button>
      </div>

      {tab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4" />
              {t('New Announcement', 'إعلان جديد', language)}
            </Button>
          </div>
          {announcements.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12 text-gray-500">
                <Megaphone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  {t('No announcements yet', 'لا توجد إعلانات بعد', language)}
                </p>
              </CardBody>
            </Card>
          ) : (
            announcements.map((ann) => {
              const colors = priorityColors[ann.priority];
              const label = priorityLabels[ann.priority];
              const Icon = ann.priority === 'urgent' ? AlertTriangle : Info;
              return (
                <Card key={ann.id}>
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {t(ann.title, ann.titleAr, language)}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors}`}>
                            {t(label.en, label.ar, language)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {t(ann.content, ann.contentAr, language)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {ann.author} - {formatDate(ann.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      )}

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

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDialog(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('New Announcement', 'إعلان جديد', language)}
              </h2>
              <button onClick={() => setShowDialog(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Title (EN)', 'العنوان (إنجليزي)', language)}
                  </label>
                  <input
                    type="text"
                    value={annForm.title}
                    onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Title (AR)', 'العنوان (عربي)', language)}
                  </label>
                  <input
                    type="text"
                    value={annForm.titleAr}
                    onChange={(e) => setAnnForm({ ...annForm, titleAr: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Content (EN)', 'المحتوى (إنجليزي)', language)}
                </label>
                <textarea
                  rows={3}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Content (AR)', 'المحتوى (عربي)', language)}
                </label>
                <textarea
                  rows={3}
                  value={annForm.contentAr}
                  onChange={(e) => setAnnForm({ ...annForm, contentAr: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Priority', 'الأولوية', language)}
                </label>
                <select
                  value={annForm.priority}
                  onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value as 'normal' | 'high' | 'urgent' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">{t('Normal', 'عادي', language)}</option>
                  <option value="high">{t('High', 'عالي', language)}</option>
                  <option value="urgent">{t('Urgent', 'عاجل', language)}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                {t('Cancel', 'إلغاء', language)}
              </Button>
              <Button
                onClick={handleCreateAnnouncement}
                loading={savingAnnouncement}
                disabled={!annForm.title.trim() || !annForm.content.trim()}
              >
                <Megaphone className="h-4 w-4" />
                {t('Publish', 'نشر', language)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
