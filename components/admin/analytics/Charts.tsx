"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS = { stroke: "#5C6778", fontSize: 11, tickLine: false, axisLine: false } as const;
const TOOLTIP_STYLE = {
  background: "#111624",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "#EEF2F8",
  fontSize: 12,
} as const;

export function TrafficChart({
  data,
}: {
  data: { date: string; visitors: number; pageviews: number }[];
}) {
  return (
    <div className="h-64 w-full" aria-label="Visitors and pageviews per day" role="img">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" {...AXIS} tickFormatter={(d: string) => d.slice(5)} />
          <YAxis {...AXIS} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
          <Area type="monotone" dataKey="pageviews" name="Pageviews" stroke="#818cf8" fill="url(#gViews)" strokeWidth={1.5} />
          <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#22d3ee" fill="url(#gVisitors)" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarsChart({
  data,
  color = "#5eead4",
  label,
}: {
  data: { name: string; value: number }[];
  color?: string;
  label: string;
}) {
  return (
    <div className="h-52 w-full" aria-label={label} role="img">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 8 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={130} {...AXIS} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" name={label} fill={color} radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
