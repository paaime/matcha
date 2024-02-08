import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3200,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2400,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Jun',
    uv: 4390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jul',
    uv: 5490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Aug',
    uv: 2490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Sep',
    uv: 1490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Oct',
    uv: 3290,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Nov',
    uv: 2990,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Dec',
    uv: 4490,
    pv: 4300,
    amt: 2100,
  },
];

export function ChartCard() {
  return (
    <Card className="col-span-full md:col-span-4 rounded-xl">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart width={150} height={350} data={data}>
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}$`}
              style={{ fontSize: '0.85rem' }}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '0.85rem' }}
            />
            <Bar dataKey="uv" fill="white" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
