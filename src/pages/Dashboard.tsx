import React from 'react';
import { Typography, Card, Button } from 'antd';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import GroupCard from '../components/GroupCard';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  console.log('Rendered Dashboard main page');

  
  const sampleEvents = [
    { title: "Лекция по ИИ", date: "Сегодня, 18:00", location: "Аудитория 101", img: "https://images.unsplash.com/photo-1591453001853-4856a95f00e9?w=500&h=300&fit=crop" },
    { title: "Сбор волонтеров", date: "Завтра, 12:00", location: "Главная площадь", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop" }
  ];

  const sampleGroups = [
    { name: "IT Клуб", desc: "Разработка, код, алгоритмы", members: 45, img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop" },
    { name: "Музыкальный бэнд", desc: "Студенческая группа и джемы", members: 12, img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
    { name: "Дискуссионный клуб", desc: "Обсуждение актуальных тем и дебаты", members: 28, img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop" }
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <Title level={2}>Добро пожаловать в Campus!</Title>
        <Paragraph type="secondary" style={{ fontSize: '16px' }}>
          Здесь вы найдете все главные события, активности и материалы для студентов.
        </Paragraph>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>Ближайшие события</Title>
          <Button type="link" onClick={() => navigate('/events')} iconPosition="end" icon={<ChevronRight size={16} />}>
            Посмотреть все
          </Button>
        </div>
        
        {}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {sampleEvents.map((ev, index) => (
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

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>Популярные группы</Title>
          <Button type="link" onClick={() => navigate('/groups')} iconPosition="end" icon={<ChevronRight size={16} />}>
            Найти больше
          </Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {sampleGroups.map((grp, index) => (
            <GroupCard 
              key={index}
              name={grp.name}
              description={grp.desc}
              membersCount={grp.members}
              avatarUrl={grp.img}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;