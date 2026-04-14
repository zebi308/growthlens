import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <MobileNav />
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
