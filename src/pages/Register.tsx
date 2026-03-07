import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { Lock, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();

  console.log('Rendered Register page');

  const onFinish = (values: any) => {
    console.log('Registration submitted:', values);
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '440px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>Регистрация</Title>
          <Text type="secondary">Присоединяйтесь к платформе нашего кампуса</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="fullName" 
            rules={[{ required: true, message: 'Пожалуйста, введите ваше полное имя' }]}
          >
            <Input 
              prefix={<User size={16} style={{ color: '#bfbfbf' }} />} 
              placeholder="ФИО" 
              size="large" 
            />
          </Form.Item>

          <Form.Item 
            name="email" 
            rules={[{ required: true, message: 'Пожалуйста, введите ваш email' }]}
          >
            <Input 
              prefix={<Mail size={16} style={{ color: '#bfbfbf' }} />} 
              placeholder="Email студента" 
              size="large" 
            />
          </Form.Item>

          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Пожалуйста, придумайте пароль' }]}
          >
            <Input.Password 
              prefix={<Lock size={16} style={{ color: '#bfbfbf' }} />} 
              placeholder="Пароль" 
              size="large" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary">Уже есть аккаунт? </Text>
          <Link onClick={() => navigate('/login')}>Войти</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;