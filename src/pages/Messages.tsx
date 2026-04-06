import React from 'react';
import { Typography, Input, Avatar, Button } from 'antd';
import { Send, Search } from 'lucide-react';
import MessageContact from '../components/MessageContact';

const { Title, Text } = Typography;

const Messages: React.FC = () => {
  console.log('Rendered Messages page');


  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#ffffff' }}>
      {}
      <div style={{ width: '350px', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 16px 16px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: '0 0 16px 0' }}>Сообщения</Title>
          <Input prefix={<Search size={16} color="#bfbfbf" />} placeholder="Поиск чатов..." style={{ borderRadius: '20px' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <MessageContact isActive name="IT Клуб (Группа)" lastMessage="Алексей: Завтра в 18:00 созвон" time="12:05" unreadCount={3} />
          <MessageContact name="Екатерина Смирнова" lastMessage="Спасибо за конспекты!" time="Вчера" unreadCount={0} avatarUrl="https://i.pravatar.cc/150?u=2"/>
          <MessageContact name="Музыкальный бэнд" lastMessage="Антон: Я принесу гитару" time="Пн" unreadCount={0} avatarUrl="https://i.pravatar.cc/150?u=3"/>
          <MessageContact name="Куратор Мария" lastMessage="Не забудьте сдать проект до пятницы" time="Пт" unreadCount={0} avatarUrl="https://i.pravatar.cc/150?u=4"/>
        </div>
      </div>

      {}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #ececec', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar src="https://i.pravatar.cc/150?u=1" size="large" />
          <div>
            <Title level={5} style={{ margin: 0 }}>IT Клуб (Группа)</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>45 участников • 12 онлайн</Text>
          </div>
        </div>
        
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '75%' }}>
            <Avatar src="https://i.pravatar.cc/150?u=5" />
            <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '16px 16px 16px 0', border: '1px solid #ececec' }}>
              <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: '#1677ff' }}>Алексей</Text>
              <Text>Всем привет! Напоминаю, что завтра в 18:00 у нас созвон по новому проекту.</Text>
              <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '8px', textAlign: 'right' }}>12:05</Text>
            </div>
          </div>
          
          {}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '75%', alignSelf: 'flex-end' }}>
             <div style={{ backgroundColor: '#1677ff', padding: '12px 16px', borderRadius: '16px 16px 0 16px' }}>
              <Text style={{ color: '#ffffff' }}>Отлично, буду! Нужно что-то подготовить?</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', display: 'block', marginTop: '8px', textAlign: 'right' }}>12:10</Text>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Input size="large" placeholder="Написать сообщение..." style={{ borderRadius: '24px' }} />
            <Button type="primary" shape="circle" size="large" icon={<Send size={18} />} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;