import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

export default function ChartWrapper({ percent1, percent2 }) {

  // Adjust data to have distinct entries for each bar
  const data = [
    { name: 'Initial Loan', value: percent1 },
    { name: 'Total Interest', value: percent2 },
  ];

  return (
    <div style={{ width: "350px", height: "250px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%" // Adjust the gap between bars to create two columns
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
