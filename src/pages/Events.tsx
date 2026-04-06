import React from 'react';
import { Typography, Button, Input, DatePicker, Segmented } from 'antd';
import { Plus, Search } from 'lucide-react';
import EventCard from '../components/EventCard';

const { Title, Text } = Typography;

const Events: React.FC = () => {
  console.log('Rendered Events page');

  const eventsData = [
    { title: "Лекция по ИИ", date: "Сегодня, 18:00", location: "Аудитория 101", img: "https://images.unsplash.com/photo-1591453001853-4856a95f00e9?w=500&h=300&fit=crop" },
    { title: "Сбор волонтеров", date: "Завтра, 12:00", location: "Главная площадь", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop" },
    { title: "Хакатон 2024", date: "15 Октября, 09:00", location: "IT Центр", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop" },
    { title: "Спортивный турнир", date: "20 Октября, 14:00", location: "Стадион", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop" }
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: '0 0 8px 0' }}>Мероприятия</Title>
          <Text type="secondary">Не пропустите важные события кампуса</Text>
        </div>
        <Button type="primary" size="large" icon={<Plus size={18} />} style={{ display: 'flex', alignItems: 'center' }}>
          Создать мероприятие
        </Button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', alignItems: 'center' }}>
        <Input 
          size="large" 
          prefix={<Search size={18} color="#bfbfbf" />} 
          placeholder="Поиск..." 
          style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}
        />
        <DatePicker size="large" placeholder="Выберите дату" style={{ width: '200px' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Segmented
            options={['Предстоящие', 'Прошедшие', 'Сохраненные']}
            size="large"
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {eventsData.map((ev, index) => (
          <EventCard 
            key={index} 
            title={ev.title} 
            date={ev.date} 
            location={ev.location} 
            imageUrl={ev.img} 
          />
        ))}
      </div>
    </div>
  );
};

export default Events;