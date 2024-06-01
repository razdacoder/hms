import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import CustomToolTip from "./custom-tooltip";

type Props = {
  data: ChartData[];
};

export default function AreaVariant({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#0e0ef0" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#0e0ef0" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#ffa500" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#ffa500" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#008000" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#008000" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#eb2626" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#eb2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="hour"
          tickFormatter={(value) => value}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomToolTip />} />
        <Area
          type="monotone"
          dataKey="check_in"
          stackId="check_in"
          strokeWidth={2}
          stroke="#0e0ef0"
          fill="#0e0ef0"
        />

        <Area
          type="monotone"
          dataKey="check_out"
          stackId="check_out"
          strokeWidth={2}
          stroke="#ffa500"
          fill="#ffa500"
        />

        <Area
          type="monotone"
          dataKey="reservation"
          stackId="reservation"
          strokeWidth={2}
          stroke="#008000"
          fill="#008000"
        />
        <Area
          type="monotone"
          dataKey="cancelled"
          stackId="cancelled"
          strokeWidth={2}
          stroke="#eb2626"
          fill="#eb2626"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
