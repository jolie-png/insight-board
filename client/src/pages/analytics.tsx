import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import type { AnalyticsData } from "@/lib/analytics";
import { formatCategoryName, getSentimentColor, getCategoryColor } from "@/lib/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-500">Failed to load analytics data</div>
      </div>
    );
  }

  const sentimentData = {
    labels: Object.keys(analytics.sentimentBreakdown).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [{
      data: Object.values(analytics.sentimentBreakdown),
      backgroundColor: Object.keys(analytics.sentimentBreakdown).map(getSentimentColor),
    }]
  };

  const statusData = {
    labels: Object.keys(analytics.statusBreakdown).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')),
    datasets: [{
      label: 'Feedback Count',
      data: Object.values(analytics.statusBreakdown),
      backgroundColor: '#3B82F6',
    }]
  };

  const categoryData = {
    labels: Object.keys(analytics.categoryBreakdown).map(formatCategoryName),
    datasets: [{
      label: 'Feedback Count',
      data: Object.values(analytics.categoryBreakdown),
      backgroundColor: Object.keys(analytics.categoryBreakdown).map(getCategoryColor),
    }]
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
            <p className="text-sm text-slate-500 mt-1">Detailed insights and trends</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Sentiment Analysis</h3>
              <div className="h-64">
                <Pie 
                  data={sentimentData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Status Distribution</h3>
              <div className="h-64">
                <Bar 
                  data={statusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Category Breakdown</h3>
            <div className="h-80">
              <Bar 
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-slate-200">
            <CardContent className="p-6 text-center">
              <h4 className="text-sm font-medium text-slate-600">Total Responses</h4>
              <p className="text-2xl font-bold text-slate-900 mt-2">{analytics.totalFeedback}</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200">
            <CardContent className="p-6 text-center">
              <h4 className="text-sm font-medium text-slate-600">Satisfaction Score</h4>
              <p className="text-2xl font-bold text-slate-900 mt-2">{analytics.satisfactionScore}</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200">
            <CardContent className="p-6 text-center">
              <h4 className="text-sm font-medium text-slate-600">Avg Response Time</h4>
              <p className="text-2xl font-bold text-slate-900 mt-2">{analytics.avgResponseTime}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
