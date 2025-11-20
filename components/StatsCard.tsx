import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
  color?: 'blue' | 'purple' | 'cyan' | 'red' | 'green';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, subtext, color = 'blue' }) => {
  // Professional color palette mapping (Light Theme Adjusted)
  const themes = {
    blue:   { text: 'text-blue-600', bg: 'bg-blue-50' },
    purple: { text: 'text-indigo-600', bg: 'bg-indigo-50' },
    cyan:   { text: 'text-cyan-600', bg: 'bg-cyan-50' },
    red:    { text: 'text-rose-600', bg: 'bg-rose-50' },
    green:  { text: 'text-emerald-600', bg: 'bg-emerald-50' },
  };
  
  const theme = themes[color];

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`rounded-lg p-2.5 ${theme.bg} ${theme.text} shadow-sm`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        {subtext && <span className="text-xs font-medium text-slate-400">{subtext}</span>}
        
        {trend && (
          <div className={`flex items-center text-xs font-bold ${
            trend === 'up' ? 'text-emerald-500' : 
            trend === 'down' ? 'text-rose-500' : 'text-slate-400'
          }`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            <span className="ml-1">{trend === 'neutral' ? 'Stable' : '12% vs avg'}</span>
          </div>
        )}
      </div>
    </div>
  );
};