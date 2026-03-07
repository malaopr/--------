import React from 'react';
import { Avatar, Typography, Badge } from 'antd';

const { Text } = Typography;

interface MessageContactProps {
  name?: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  avatarUrl?: string;
  isActive?: boolean;
}

// Isolated message contact item for the sidebar
const MessageContact: React.FC<MessageContactProps> = ({
  name = "Александр Иванов",
  lastMessage = "Привет, ты пойдешь на лекцию завтра?",
  time = "10:35",
  unreadCount = 2,
  avatarUrl = "https://i.pravatar.cc/150?u=1",
  isActive = false
}) => {
  console.log('Rendering MessageContact item for:', name);

  return (
    <div 
      data-cmp="MessageContact" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px 16px', 
        cursor: 'pointer',
        backgroundColor: isActive ? '#e6f4ff' : 'transparent',
        borderBottom: '1px solid #f0f0f0',
        transition: 'background-color 0.2s'
      }}
    >
      <Badge count={unreadCount} size="small" offset={[-4, 4]}>
        <Avatar src={avatarUrl} size="large" />
      </Badge>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <Text strong style={{ fontSize: '14px' }} ellipsis>{name}</Text>
          <Text type="secondary" style={{ fontSize: '12px', flexShrink: 0 }}>{time}</Text>
        </div>
        <Text type="secondary" style={{ fontSize: '13px', display: 'block' }} ellipsis>
          {lastMessage}
        </Text>
      </div>
    </div>
  );
};

export default MessageContact;