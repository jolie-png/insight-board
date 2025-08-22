import { MessageCircle, Clock, Timer, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsGridProps {
  totalFeedback: number;
  pendingReview: number;
  avgResponseTime: string;
  satisfactionScore: string;
}

export default function MetricsGrid({ 
  totalFeedback, 
  pendingReview, 
  avgResponseTime, 
  satisfactionScore 
}: MetricsGridProps) {
  const metrics = [
    {
      title: "Total Feedback",
      value: totalFeedback.toLocaleString(),
      change: "+12% from last month",
      changeType: "positive",
      icon: MessageCircle,
      iconBg: "bg-primary bg-opacity-10",
      iconColor: "text-primary",
    },
    {
      title: "Pending Review",
      value: pendingReview.toString(),
      change: "Needs attention",
      changeType: "warning",
      icon: Clock,
      iconBg: "bg-warning bg-opacity-10",
      iconColor: "text-warning",
    },
    {
      title: "Avg. Response Time",
      value: avgResponseTime,
      change: "-18% improvement",
      changeType: "positive",
      icon: Timer,
      iconBg: "bg-secondary bg-opacity-10",
      iconColor: "text-secondary",
    },
    {
      title: "Satisfaction Score",
      value: satisfactionScore,
      change: "+0.3 this month",
      changeType: "positive",
      icon: Star,
      iconBg: "bg-secondary bg-opacity-10",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2" data-testid={`metric-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        metric.changeType === 'positive' 
                          ? 'bg-secondary bg-opacity-10 text-secondary'
                          : 'bg-warning bg-opacity-10 text-warning'
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.iconBg}`}>
                  <Icon className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
