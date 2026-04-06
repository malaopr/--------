import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messages from "./pages/Messages";
import Groups from "./pages/Groups";
import Events from "./pages/Events";
import Sidebar from "./components/Sidebar";

const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  console.log('Current route initialized in AppContent:', location.pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {}
      <div style={{ display: isAuthRoute ? 'none' : 'block', width: '250px', borderRight: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
        <Sidebar />
      </div>
      
      {}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: isAuthRoute ? '#f0f2f5' : '#ffffff' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;