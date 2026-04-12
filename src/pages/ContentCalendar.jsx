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

const PLATFORM_DOT = {
  LinkedIn: 'bg-blue-500', Twitter: 'bg-sky-400', 'Twitter/X': 'bg-sky-400',
  Instagram: 'bg-pink-500', TikTok: 'bg-purple-500', YouTube: 'bg-red-500', Facebook: 'bg-indigo-500',
};

const FREE_CALENDAR_LIMIT = 7;

export default function ContentCalendar() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const [viewMode, setViewMode] = useState('grid');
  const { isPro } = useUserPlan();

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses-cal'],
    queryFn: () => appClient.entities.BrandAnalysis.list('-created_date', 20),
  });

  const analysis = id ? analyses.find(a => a.id === id) : analyses.find(a => a.status === 'completed');
  const fullCalendar = analysis?.content_calendar || [];
  const visibleCalendar = isPro ? fullCalendar : fullCalendar.slice(0, FREE_CALENDAR_LIMIT);
  const lockedCalendar = isPro ? [] : fullCalendar.slice(FREE_CALENDAR_LIMIT);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <div className="glass-card rounded-2xl p-12 animate-pulse neon-border"><div className="h-40 bg-muted rounded" /></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl mx-auto text-center py-20">
        <p className="text-muted-foreground mb-4">No completed analysis found. Run an analysis first.</p>
        <Link to="/dashboard/new-analysis"><Button>Start New Analysis</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={id ? `/dashboard/results?id=${id}` : '/dashboard'} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Content Calendar</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isPro ? `${fullCalendar.length}-day` : '7-day'} content plan — drag to reorder posts
              {!isPro && lockedCalendar.length > 0 && (
                <span className="text-primary ml-1">(Pro unlocks {fullCalendar.length} days)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3 mr-2">
              {Object.entries(PLATFORM_DOT).slice(0, 4).map(([p, c]) => (
                <div key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${c}`} /> {p}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>
                <Calendar className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
            {isPro && visibleCalendar.length > 0 && (
              <ExportMenu
                label="Export"
                onExportCsv={() => exportCalendarCsv(fullCalendar, analysis.industry)}
                onExportPdf={() => exportCalendarPdf(fullCalendar, analysis.industry)}
              />
            )}
          </div>
        </div>

        {visibleCalendar.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {visibleCalendar.map((item, i) => (
                <CalendarDay key={i} item={item} index={i} />
              ))}
            </div>

            {!isPro && lockedCalendar.length > 0 && (
              <div className="relative mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 blur-sm pointer-events-none opacity-40">
                  {lockedCalendar.slice(0, 6).map((item, i) => (
                    <CalendarDay key={`locked-${i}`} item={item} index={i} />
                  ))}
                </div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1 font-medium">+{lockedCalendar.length} more days of content</p>
                  <p className="text-xs text-muted-foreground mb-3">Unlock the full 30-day calendar with Pro</p>
                  <Link to="/dashboard/pricing">
                    <Button size="sm" className="gap-1.5 rounded-lg">
                      <Zap className="w-3 h-3" /> Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center neon-border mt-6">
            <p className="text-muted-foreground">No content calendar generated for this analysis.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}