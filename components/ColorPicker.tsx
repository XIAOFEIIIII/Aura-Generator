import React from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  onRemove?: () => void;
  canRemove?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  color, 
  onChange, 
  onRemove, 
  canRemove = false 
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100 ring-offset-1 shadow-inner">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
            aria-label={`Select ${label}`}
          />
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-mono text-slate-700">{color}</span>
        </div>
      </div>
      
      {canRemove && onRemove && (
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
          aria-label="Remove color"
          title="Remove color"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};
