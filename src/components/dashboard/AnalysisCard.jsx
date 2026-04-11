import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import GradeCircle from './GradeCircle';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  analyzing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AnalysisCard({ analysis }) {
  return (
    <Link to={`/results?id=${analysis.id}`}>
      <Card className="p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusStyles[analysis.status] || statusStyles.pending}>
                {analysis.status}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(analysis.created_date), 'MMM d, yyyy')}
              </span>
            </div>
            <h3 className="font-semibold text-foreground truncate">{analysis.industry}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {analysis.goals?.join(', ') || 'No goals set'}
            </p>
          </div>
          {analysis.status === 'completed' && analysis.overall_grade && (
            <div className="ml-4 flex-shrink-0">
              <GradeCircle grade={analysis.overall_grade} size="sm" />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View Details <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </Card>
    </Link>
  );
}