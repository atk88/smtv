import React from 'react';
import { Monitor } from 'lucide-react';
import { Controls } from './Controls';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-blue-400" />
          <h1 className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SMTV Multi-Screen Player
          </h1>
        </div>
        <Controls />
      </div>
    </header>
  );
}