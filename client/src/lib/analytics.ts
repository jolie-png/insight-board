export interface AnalyticsData {
  totalFeedback: number;
  pendingReview: number;
  avgResponseTime: string;
  satisfactionScore: string;
  categoryBreakdown: Record<string, number>;
  sentimentBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  trends: Array<{
    date: string;
    total: number;
    resolved: number;
  }>;
}

export function calculatePercentageChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

export function formatCategoryName(category: string): string {
  const categoryLabels: Record<string, string> = {
    'bug-report': 'Bug Reports',
    'feature-request': 'Feature Requests',
    'ui-ux': 'UI/UX',
    'performance': 'Performance',
    'general': 'General',
    'other': 'Other',
  };
  
  return categoryLabels[category] || category;
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return '#10B981'; // green
    case 'negative':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
}

export function getCategoryColor(category: string): string {
  const colors = [
    '#EF4444', // red - bug-report
    '#3B82F6', // blue - feature-request
    '#10B981', // green - ui-ux
    '#F59E0B', // yellow - performance
    '#8B5CF6', // purple - general
    '#6B7280', // gray - other
  ];
  
  const categories = ['bug-report', 'feature-request', 'ui-ux', 'performance', 'general', 'other'];
  const index = categories.indexOf(category);
  return colors[index] || colors[colors.length - 1];
}
