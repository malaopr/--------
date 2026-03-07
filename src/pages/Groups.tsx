import React from 'react';
import { Typography, Input, Button, Tabs } from 'antd';
import { Search, Plus } from 'lucide-react';
import GroupCard from '../components/GroupCard';

const { Title } = Typography;

const Groups: React.FC = () => {
  console.log('Rendered Groups page');

 
  const groupsList = [
    { name: "IT Клуб", desc: "Разработка, код, алгоритмы", members: 45, img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop" },
    { name: "Музыкальный бэнд", desc: "Студенческая группа и джемы", members: 12, img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
    { name: "Дискуссионный клуб", desc: "Обсуждение актуальных тем и дебаты", members: 28, img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop" },
    { name: "Киноклуб", desc: "Просмотр и анализ шедевров кинематографа", members: 56, img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop" },
    { name: "Шахматный кружок", desc: "Спарринги и турниры по шахматам", members: 18, img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=100&h=100&fit=crop" }
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: '0 0 8px 0' }}>Группы и клубы</Title>
          <Typography.Text type="secondary">Найдите сообщество по интересам</Typography.Text>
        </div>
        <Button type="primary" size="large" icon={<Plus size={18} />} style={{ display: 'flex', alignItems: 'center' }}>
          Создать группу
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <Input 
          size="large" 
          prefix={<Search size={18} color="#bfbfbf" />} 
          placeholder="Поиск групп по названию или интересам" 
          style={{ maxWidth: '400px' }}
        />
      </div>

      <Tabs 
        defaultActiveKey="1" 
        items={[
          {
            key: '1',
            label: 'Все группы',
            children: (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '16px' }}>
                {groupsList.map((grp, index) => (
                  <GroupCard 
                    key={index}
                    name={grp.name}
                    description={grp.desc}
                    membersCount={grp.members}
                    avatarUrl={grp.img}
                  />
                ))}
              </div>
            )
          },
          {
            key: '2',
            label: 'Мои группы',
            children: (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '16px' }}>
                <GroupCard 
                  name={groupsList[0].name}
                  description={groupsList[0].desc}
                  membersCount={groupsList[0].members}
                  avatarUrl={groupsList[0].img}
                />
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default Groups;