
import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ImageIcon className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          PIX2<span className="text-blue-600">PDF</span>
        </h1>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
          <Sparkles size={16} className="text-yellow-500" />
          Pro Conversion Engine
        </span>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
        >
          Documentation
        </a>
      </div>
    </header>
  );
};
