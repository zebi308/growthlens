import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function UpgradeOverlay({ message = 'Upgrade to Pro to unlock' }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
        <Lock className="w-5 h-5 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground mb-3 text-center px-4">{message}</p>
        <Link to="/pricing">
          <Button size="sm" className="gap-1.5 rounded-lg text-xs">
            <Zap className="w-3 h-3" /> Upgrade to Pro
          </Button>
        </Link>
      </div>
    </div>
  );
}
