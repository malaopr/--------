import React from 'react';
import { Card, Typography, Button } from 'antd';
import { Calendar as CalendarIcon, MapPin, Users } from 'lucide-react';

const { Title, Text } = Typography;

interface EventCardProps {
  title?: string;
  date?: string;
  location?: string;
  attendeesCount?: number;
  imageUrl?: string;
}

// EventCard with default values for proper isolated preview support
const EventCard: React.FC<EventCardProps> = ({
  title = "Welcome Party 2024",
  date = "2024-09-01 18:00",
  location = "Main Campus Hall",
  attendeesCount = 120,
  imageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop"
}) => {
  console.log('Rendering EventCard with title:', title);

  return (
    <div data-cmp="EventCard" style={{ width: '100%', maxWidth: '300px' }}>
      <Card
        hoverable
        cover={<img alt={title} src={imageUrl} style={{ height: 160, objectFit: 'cover' }} />}
        styles={{ body: { padding: '16px' } }}
      >
        <Title level={5} style={{ marginTop: 0, marginBottom: '12px', minHeight: '48px' }}>
          {title}
        </Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#595959' }}>
            <CalendarIcon size={16} style={{ marginRight: 8, color: '#1677ff' }} />
            <Text type="secondary">{date}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#595959' }}>
            <MapPin size={16} style={{ marginRight: 8, color: '#1677ff' }} />
            <Text type="secondary">{location}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#595959' }}>
            <Users size={16} style={{ marginRight: 8, color: '#1677ff' }} />
            <Text type="secondary">{attendeesCount} участников</Text>
          </div>
        </div>
        <Button type="primary" block>
          Участвовать
        </Button>
      </Card>
    </div>
  );
};

export default EventCard;