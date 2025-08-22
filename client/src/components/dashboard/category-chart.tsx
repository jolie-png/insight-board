import { Card, CardContent } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  categoryBreakdown: Record<string, number>;
}

export default function CategoryChart({ categoryBreakdown }: CategoryChartProps) {
  const categoryLabels: Record<string, string> = {
    'bug-report': 'Bug Reports',
    'feature-request': 'Feature Requests',
    'ui-ux': 'UI/UX',
    'performance': 'Performance',
    'general': 'General',
    'other': 'Other',
  };

  const data = {
    labels: Object.keys(categoryBreakdown).map(key => categoryLabels[key] || key),
    datasets: [
      {
        data: Object.values(categoryBreakdown),
        backgroundColor: [
          '#EF4444', // red
          '#3B82F6', // blue
          '#10B981', // green
          '#F59E0B', // yellow
          '#8B5CF6', // purple
          '#6B7280', // gray
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
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
          <h3 className="text-lg font-semibold text-slate-900">Feedback Categories</h3>
          <button className="text-sm text-primary hover:text-blue-600" data-testid="button-view-all-categories">
            View All
          </button>
        </div>
        <div className="h-64">
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
