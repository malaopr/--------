import React from 'react';
import { Card, Typography, Avatar, Button } from 'antd';
import { Users, AlertCircle } from 'lucide-react';

const { Title, Paragraph } = Typography;

interface GroupCardProps {
  name?: string;
  description?: string;
  membersCount?: number;
  category?: string;
  avatarUrl?: string;
}


const GroupCard: React.FC<GroupCardProps> = ({
  name = "IT Club",
  description = "Сообщество для программистов и энтузиастов новых технологий.",
  membersCount = 45,
  category = "Технологии",
  avatarUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop"
}) => {
  console.log('Rendering GroupCard:', name);

  return (
    <div data-cmp="GroupCard" style={{ width: '100%', maxWidth: '300px' }}>
      <Card hoverable styles={{ body: { padding: '20px' } }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
          <Avatar src={avatarUrl} size={48} style={{ flexShrink: 0 }} />
          <div>
            <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>{name}</Title>
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>{category}</Typography.Text>
          </div>
        </div>
        
        <Paragraph type="secondary" style={{ height: '44px', overflow: 'hidden', marginBottom: '16px', fontSize: '14px' }}>
          {description}
        </Paragraph>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#595959' }}>
            <Users size={16} style={{ marginRight: 6 }} />
            <Typography.Text strong>{membersCount}</Typography.Text>
          </div>
          <Button type="default" size="small">Вступить</Button>
        </div>
      </Card>
    </div>
  );
};

export default GroupCard;
