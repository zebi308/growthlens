import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { appClient } from '@/api/appClient';

function UserHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    appClient.auth.me().then(setUser).catch(() => {});
  }, []);

  if (!user) return null;

  const initials = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="fixed top-0 right-0 z-30 p-4 flex items-center gap-3 lg:block hidden">
      <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-3 border border-white/10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate max-w-[150px]">{user.full_name || 'User'}</p>
          <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <MobileNav />
      <UserHeader />
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
}