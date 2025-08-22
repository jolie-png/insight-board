import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import FeedbackTrendsChart from "@/components/dashboard/feedback-trends-chart";
import CategoryChart from "@/components/dashboard/category-chart";
import FeedbackTable from "@/components/feedback/feedback-table";
import FeedbackModal from "@/components/feedback/feedback-modal";
import type { AnalyticsData } from "@/lib/analytics";
import type { Feedback } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("30");

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback", searchQuery, statusFilter === "all" ? "" : statusFilter],
  });

  const handleExportData = () => {
    if (!feedback.length) return;
    
    const csvContent = [
      ['Name', 'Email', 'Category', 'Priority', 'Status', 'Sentiment', 'Message', 'Date'].join(','),
      ...feedback.map(f => [
        f.userName,
        f.userEmail || '',
        f.category,
        f.priority,
        f.status,
        f.sentiment || 'neutral',
        `"${f.message.replace(/"/g, '""')}"`,
        new Date(f.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (analyticsLoading || feedbackLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-500">Loading dashboard...</div>
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

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
            <p className="text-sm text-slate-500 mt-1">Monitor and analyze user feedback in real-time</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Period:</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40" data-testid="select-date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleExportData} className="flex items-center space-x-2" data-testid="button-export-data">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <MetricsGrid
          totalFeedback={analytics.totalFeedback}
          pendingReview={analytics.pendingReview}
          avgResponseTime={analytics.avgResponseTime}
          satisfactionScore={analytics.satisfactionScore}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FeedbackTrendsChart trends={analytics.trends} />
          <CategoryChart categoryBreakdown={analytics.categoryBreakdown} />
        </div>

        <FeedbackTable
          feedback={feedback}
          onSearch={setSearchQuery}
          onFilterStatus={(status) => setStatusFilter(status === "all" ? "" : status)}
        />
      </div>

      <FeedbackModal />
    </>
  );
}
