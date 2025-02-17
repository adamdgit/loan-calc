import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

export default function ChartWrapper({ percent1, percent2 }) {

  // Adjust data to have distinct entries for each bar
  const data = [
    { name: 'Initial Loan', value: percent1 },
    { name: 'Total Interest', value: percent2 },
  ];

  return (
    <div className='chart-wrap'>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <CartesianGrid strokeDasharray="3 3" />
          
          <Bar dataKey="value" fill="rgb(51, 150, 231">
            <LabelList dataKey="value" position="top" formatter={(value) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
