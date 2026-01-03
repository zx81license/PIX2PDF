
import React from 'react';
import { PDFSettings, PageSize, Orientation, Margin, ImageScale } from '../types';

interface ControlsProps {
  settings: PDFSettings;
  setSettings: React.Dispatch<React.SetStateAction<PDFSettings>>;
  isDisabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ settings, setSettings, isDisabled }) => {
  const updateSetting = <K extends keyof PDFSettings>(key: K, value: PDFSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";
  const selectClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50";

  return (
    <div className={`space-y-6 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
      
      <div>
        <label className={labelClass}>Page Format</label>
        <select 
          className={selectClass}
          value={settings.pageSize}
          onChange={(e) => updateSetting('pageSize', e.target.value as PageSize)}
        >
          <option value="fit">Auto (Fit to Image)</option>
          <option value="a4">A4 (210 x 297 mm)</option>
          <option value="a3">A3 (297 x 420 mm)</option>
          <option value="letter">Letter (8.5 x 11 in)</option>
          <option value="legal">Legal (8.5 x 14 in)</option>
        </select>
      </div>

      {settings.pageSize !== 'fit' && (
        <>
          <div>
            <label className={labelClass}>Orientation</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSetting('orientation', 'portrait')}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  settings.orientation === 'portrait' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => updateSetting('orientation', 'landscape')}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  settings.orientation === 'landscape' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Image Scaling</label>
            <select 
              className={selectClass}
              value={settings.imageScale}
              onChange={(e) => updateSetting('imageScale', e.target.value as ImageScale)}
            >
              <option value="fit">Contain (Fit to Page)</option>
              <option value="fill">Cover (Fill Page)</option>
              <option value="original">Original Size</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Margins</label>
            <div className="grid grid-cols-4 gap-1">
              {(['none', 'small', 'medium', 'large'] as Margin[]).map((m) => (
                <button
                  key={m}
                  onClick={() => updateSetting('margin', m)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all capitalize ${
                    settings.margin === m 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div>
        <label className={labelClass}>Quality ({Math.round(settings.quality * 100)}%)</label>
        <input 
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={settings.quality}
          onChange={(e) => updateSetting('quality', parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>Small File</span>
          <span>Best Quality</span>
        </div>
      </div>

    </div>
  );
};
