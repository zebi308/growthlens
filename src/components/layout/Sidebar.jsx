import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, Calendar, Lightbulb, LogOut, Sparkles, Zap, BarChart2, DollarSign } from 'lucide-react';
import { appClient } from '@/api/appClient';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/new-analysis', icon: Plus, label: 'New Analysis' },
  { path: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { path: '/content-calendar', icon: Calendar, label: 'Content Calendar' },
  { path: '/competitors', icon: BarChart2, label: 'Competitors' },
  { path: '/pricing', icon: DollarSign, label: 'Pricing' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">Outpace</h1>
          <p className="text-[11px] text-sidebar-foreground/50 tracking-wide uppercase">Personal Brand Builder</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto border-t border-sidebar-border space-y-1">
        <Link
          to="/premium"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-400 hover:bg-amber-400/10 transition-all w-full"
        >
          <Zap className="w-4 h-4" />
          Premium Features
        </Link>
        <button
          onClick={async () => {
            await appClient.auth.logout();
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}