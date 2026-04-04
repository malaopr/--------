import React from 'react';
import { Menu, Typography } from 'antd';
import { Home, MessageCircle, Users, Calendar, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;


const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Rendering Sidebar component');

 
  const menuItems = [
    {
      key: '/',
      icon: <Home size={18} />,
      label: 'Главная',
    },
    {
      key: '/messages',
      icon: <MessageCircle size={18} />,
      label: 'Сообщения',
    },
    {
      key: '/groups',
      icon: <Users size={18} />,
      label: 'Группы',
    },
    {
      key: '/events',
      icon: <Calendar size={18} />,
      label: 'Мероприятия',
    }
  ];

  const handleMenuClick = (e: { key: string }) => {
    console.log('Navigating to:', e.key);
    navigate(e.key);
  };

  const handleLogout = () => {
    console.log('Logging out user');
    navigate('/login');
  };

  return (
    <div data-cmp="Sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '24px 24px 12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={20} color="#ffffff" />
        </div>
        <Title level={4} style={{ margin: 0, color: '#1677ff' }}>Campus App</Title>
      </div>
      
      <div style={{ flex: 1, marginTop: '16px' }}>
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ borderRight: 'none', backgroundColor: 'transparent' }}
        />
      </div>

      <div style={{ padding: '24px' }}>
        <Menu
          mode="vertical"
          selectable={false}
          onClick={handleLogout}
          items={[
            {
              key: 'logout',
              icon: <LogOut size={18} />,
              label: 'Выйти',
              danger: true,
            }
          ]}
          style={{ borderRight: 'none', backgroundColor: 'transparent' }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
