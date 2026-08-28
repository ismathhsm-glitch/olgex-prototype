import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Sidebar />
      <Navbar />
      <main style={{ marginLeft: '260px', padding: '2rem', minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </main>
    </div>
  );
};
