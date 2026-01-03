
import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageData } from '../types';

interface ImageCardProps {
  data: ImageData;
  index: number;
  total: number;
  onRemove: () => void;
  onMove: (direction: 'left' | 'right') => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ data, index, total, onRemove, onMove }) => {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-64 flex flex-col">
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={onRemove}
          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-lg"
        >
          <X size={16} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-24 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <button
          onClick={() => onMove('left')}
          disabled={index === 0}
          className={`pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => onMove('right')}
          disabled={index === total - 1}
          className={`pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex-grow bg-slate-100 relative overflow-hidden flex items-center justify-center">
        <img 
          src={data.previewUrl} 
          alt={data.name} 
          className="max-h-full max-w-full object-contain"
        />
        <div className="absolute bottom-2 left-2 bg-black/40 px-2 py-0.5 rounded text-[10px] text-white font-mono uppercase">
          {data.width}x{data.height}
        </div>
        <div className="absolute top-2 left-2 bg-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-white font-bold text-xs shadow-md">
          {index + 1}
        </div>
      </div>

      <div className="p-3 bg-white border-t border-slate-100">
        <p className="text-sm font-medium text-slate-700 truncate">{data.name}</p>
        <p className="text-[10px] text-slate-400 mt-1">{(data.file.size / 1024).toFixed(1)} KB</p>
      </div>
    </div>
  );
};
