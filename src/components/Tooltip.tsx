import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'bottom',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-6 sm:left-1/2 sm:-translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent',
  }[position];

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="region"
      aria-label={typeof content === 'string' ? content : undefined}
    >
      {children}
      <div
        role="tooltip"
        className={`absolute z-50 pointer-events-none transition-all duration-200 ease-out ${positionClasses} ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0 visible'
            : 'opacity-0 scale-95 translate-y-1 invisible'
        }`}
      >
        <div className="relative bg-slate-900/95 text-slate-100 text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>{content}</span>
          <div className={`absolute w-0 h-0 border-[5px] ${arrowClasses}`} />
        </div>
      </div>
    </div>
  );
};
