import { useState } from "react";
import { Eye, Edit, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Feedback } from "@shared/schema";

interface FeedbackTableProps {
  feedback: Feedback[];
  onSearch: (query: string) => void;
  onFilterStatus: (status: string) => void;
}

export default function FeedbackTable({ feedback, onSearch, onFilterStatus }: FeedbackTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/feedback/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Feedback status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update feedback status",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug-report':
        return 'bg-red-100 text-red-800';
      case 'feature-request':
        return 'bg-green-100 text-green-800';
      case 'ui-ux':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Recent Feedback</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-feedback"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <Select onValueChange={onFilterStatus}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Feedback</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Sentiment</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {feedback.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No feedback found. Try adjusting your search or filters.
                </td>
              </tr>
            ) : (
              feedback.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors" data-testid={`row-feedback-${item.id}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-600">
                          {item.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.userName}</p>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.message}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {formatCategory(item.category)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{getSentimentIcon(item.sentiment)}</span>
                      <span className="text-sm text-slate-600 capitalize">{item.sentiment || 'neutral'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-500">{formatDate(item.createdAt)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-slate-600 p-1"
                        data-testid={`button-view-${item.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-slate-600 p-1"
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {item.status !== 'resolved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-slate-600 p-1"
                          onClick={() => updateStatusMutation.mutate({ id: item.id, status: 'resolved' })}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`button-resolve-${item.id}`}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
