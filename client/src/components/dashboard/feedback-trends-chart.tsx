import { Card, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendData {
  date: string;
  total: number;
  resolved: number;
}

interface FeedbackTrendsChartProps {
  trends: TrendData[];
}

export default function FeedbackTrendsChart({ trends }: FeedbackTrendsChartProps) {
  const data = {
    labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Total Feedback',
        data: trends.map(t => t.total),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Resolved',
        data: trends.map(t => t.resolved),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F1F5F9',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Feedback Trends</h3>
          <div className="flex items-center space-x-2">
            <button className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded">Daily</button>
            <button className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">Weekly</button>
            <button className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded">Monthly</button>
          </div>
        </div>
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
