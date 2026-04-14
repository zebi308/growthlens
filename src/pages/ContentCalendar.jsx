import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { appClient } from '@/api/appClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, List, GripVertical, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ExportMenu from '@/components/shared/ExportMenu';
import { exportCalendarCsv, exportCalendarPdf } from '@/utils/exportHelpers';
import CalendarDay from '@/components/calendar/CalendarDay';
import { useUserPlan } from '@/hooks/useUserPlan';
import { getAnalysisLabel } from '@/utils/analysisHelpers';
import { format } from 'date-fns';

const PLATFORM_DOT = {
  LinkedIn: 'bg-blue-500', Twitter: 'bg-sky-400', 'Twitter/X': 'bg-sky-400',
  Instagram: 'bg-pink-500', TikTok: 'bg-purple-500', YouTube: 'bg-red-500', Facebook: 'bg-indigo-500',
};

const PLATFORM_COLORS = {
  LinkedIn: 'border-l-blue-500 bg-blue-500/5', Twitter: 'border-l-sky-400 bg-sky-400/5',
  'Twitter/X': 'border-l-sky-400 bg-sky-400/5', Instagram: 'border-l-pink-500 bg-pink-500/5',
  TikTok: 'border-l-purple-500 bg-purple-500/5', YouTube: 'border-l-red-500 bg-red-500/5',
  Facebook: 'border-l-indigo-500 bg-indigo-500/5',
};

const BEST_TIMES = {
  Instagram: '6–9 PM', TikTok: '7–9 PM', LinkedIn: '8–10 AM',
  Twitter: '12–3 PM', 'Twitter/X': '12–3 PM', YouTube: '2–4 PM', Facebook: '1–4 PM',
};

const FREE_CALENDAR_LIMIT = 7;

function WeeklyCalendarView({ items }) {
  const [calItems, setCalItems] = useState(() =>
    items.map((item, i) => ({ ...item, id: `item-${i}` }))
  );
  const dragIndex = useRef(null);
  const overIndex = useRef(null);

  const handleDragStart = (i) => { dragIndex.current = i; };
  const handleDragOver = (e, i) => { e.preventDefault(); overIndex.current = i; };
  const handleDrop = () => {
    if (dragIndex.current === null || overIndex.current === null) return;
    const newItems = Array.from(calItems);
    const [moved] = newItems.splice(dragIndex.current, 1);
    newItems.splice(overIndex.current, 0, moved);
    setCalItems(newItems);
    dragIndex.current = null;
    overIndex.current = null;
  };

  return (
    <div className="space-y-3">
      {calItems.map((item, index) => {
        const colorClass = PLATFORM_COLORS[item.platform] || 'border-l-white/20 bg-white/2';
        const dotClass = PLATFORM_DOT[item.platform] || 'bg-muted-foreground';
        const bestTime = BEST_TIMES[item.platform];
        return (
          <div key={item.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDrop={handleDrop}
            className={`glass-card rounded-xl border-l-4 ${colorClass} p-4 flex items-center gap-4 transition-all duration-150 cursor-grab active:cursor-grabbing`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
            <div className="flex-shrink-0 text-center w-10">
              <p className="text-xs font-bold text-muted-foreground uppercase">Day</p>
              <p className="text-xl font-black text-foreground">{item.day}</p>
            </div>
            <div className="flex-shrink-0"><span className={`w-2.5 h-2.5 rounded-full block ${dotClass}`} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-semibold text-foreground">{item.topic}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.platform}</Badge>
                {item.post_type && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.post_type}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{item.caption}</p>
            </div>
            <div className="flex-shrink-0 text-right hidden sm:block">
              {bestTime && <div className="text-[10px] text-muted-foreground"><span className="text-emerald-400 font-semibold">⏰ {bestTime}</span></div>}
              {item.best_time && <div className="text-[10px] text-muted-foreground mt-0.5">{item.best_time}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ContentCalendar() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedId, setSelectedId] = useState(id || null);
  const { isPro } = useUserPlan();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses-cal'],
    queryFn: () => appClient.entities.BrandAnalysis.list('-created_date', 20),
  });

  const completedAnalyses = analyses.filter(a => a.status === 'completed');
  const analysis = selectedId ? completedAnalyses.find(a => a.id === selectedId) : completedAnalyses[0];

  const fullCalendar = analysis?.content_calendar || [];
  const visibleCalendar = isPro ? fullCalendar : fullCalendar.slice(0, FREE_CALENDAR_LIMIT);
  const lockedCalendar = isPro ? [] : fullCalendar.slice(FREE_CALENDAR_LIMIT);

  if (isLoading) {
    return <div className="p-6 lg:p-10 max-w-5xl mx-auto"><div className="glass-card rounded-2xl p-12 animate-pulse neon-border"><div className="h-40 bg-muted rounded" /></div></div>;
  }

  if (!analysis) {
    return <div className="p-6 lg:p-10 max-w-5xl mx-auto text-center py-20"><p className="text-muted-foreground mb-4">No completed analysis found.</p><Link to="/dashboard/new-analysis"><Button>Start New Analysis</Button></Link></div>;
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={selectedId ? `/dashboard/results?id=${selectedId}` : '/dashboard'} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Content Calendar</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isPro ? `${fullCalendar.length}-day` : '7-day'} content plan — drag to reorder posts
              {!isPro && lockedCalendar.length > 0 && <span className="text-primary ml-1">(Pro unlocks {fullCalendar.length} days)</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3 mr-2">
              {Object.entries(PLATFORM_DOT).slice(0, 4).map(([p, c]) => (
                <div key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`w-2 h-2 rounded-full ${c}`} /> {p}</div>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground'}`}><Calendar className="w-3.5 h-3.5" /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'}`}><List className="w-3.5 h-3.5" /></button>
            </div>
            {isPro && visibleCalendar.length > 0 && (
              <ExportMenu label="Export" onExportCsv={() => exportCalendarCsv(fullCalendar, analysis.industry)} onExportPdf={() => exportCalendarPdf(fullCalendar, analysis.industry)} />
            )}
          </div>
        </div>

        {/* Analysis Selector */}
        {completedAnalyses.length > 1 && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Select analysis</p>
            <div className="flex flex-wrap gap-2">
              {completedAnalyses.map((a) => {
                const label = getAnalysisLabel(a);
                return (
                  <button key={a.id} onClick={() => setSelectedId(a.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                      (selectedId || analysis.id) === a.id ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
                    }`}
                  >
                    <span className="font-semibold">{label.username}</span>
                    <span className="text-muted-foreground ml-1">· {label.platforms.join(', ')}</span>
                    <span className="text-muted-foreground ml-1">· {a.created_date ? format(new Date(a.created_date), 'MMM d') : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {visibleCalendar.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {visibleCalendar.map((item, i) => <CalendarDay key={i} item={item} index={i} />)}
              </div>
            ) : (
              <div className="mt-4"><WeeklyCalendarView items={visibleCalendar} /></div>
            )}
            {!isPro && lockedCalendar.length > 0 && (
              <div className="relative mt-4">
                {viewMode === 'grid' ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 blur-sm pointer-events-none opacity-40">
                    {lockedCalendar.slice(0, 6).map((item, i) => <CalendarDay key={`l-${i}`} item={item} index={i} />)}
                  </div>
                ) : (
                  <div className="blur-sm pointer-events-none opacity-40"><WeeklyCalendarView items={lockedCalendar.slice(0, 6)} /></div>
                )}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1 font-medium">+{lockedCalendar.length} more days</p>
                  <p className="text-xs text-muted-foreground mb-3">Unlock full calendar with Pro</p>
                  <Link to="/dashboard/pricing"><Button size="sm" className="gap-1.5 rounded-lg"><Zap className="w-3 h-3" /> Upgrade to Pro</Button></Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center neon-border mt-6"><p className="text-muted-foreground">No content calendar generated.</p></div>
        )}
      </motion.div>
    </div>
  );
}
