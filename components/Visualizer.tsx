
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TradeRow } from '../types';

interface Props {
  data: TradeRow[];
}

const Visualizer: React.FC<Props> = ({ data }) => {
  // Sample data to keep chart performant if there are thousands of rows
  const chartData = React.useMemo(() => {
    if (data.length <= 100) return data;
    const skip = Math.ceil(data.length / 100);
    return data.filter((_, idx) => idx % skip === 0 || idx === data.length - 1);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Trade #{label}</p>
          <p className="text-sm font-bold text-slate-900">
            Balance: <span className="text-indigo-600">${payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Profit: +${payload[0].payload.profit.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="index" 
          tick={{ fontSize: 12, fill: '#94a3b8' }} 
          axisLine={false}
          tickLine={false}
          minTickGap={50}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#94a3b8' }} 
          axisLine={false}
          tickLine={false}
          tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="balance" 
          stroke="#6366f1" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorBalance)" 
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Visualizer;
