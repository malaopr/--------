import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();

  console.log('Rendered Login page');

  const onFinish = (values: any) => {
    console.log('Login credentials submitted:', values);
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>С возвращением</Title>
          <Text type="secondary">Пожалуйста, войдите в свой аккаунт кампуса</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
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
            rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
          >
            <Input.Password 
              prefix={<Lock size={16} style={{ color: '#bfbfbf' }} />} 
              placeholder="Пароль" 
              size="large" 
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <Link href="#">Забыли пароль?</Link>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Войти
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary">Нет аккаунта? </Text>
          <Link onClick={() => navigate('/register')}>Создать аккаунт</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;