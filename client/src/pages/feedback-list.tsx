import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FeedbackTable from "@/components/feedback/feedback-table";
import FeedbackModal from "@/components/feedback/feedback-modal";
import type { Feedback } from "@shared/schema";

export default function FeedbackList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: feedback = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback", searchQuery, statusFilter === "all" ? "" : statusFilter],
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-500">Loading feedback...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">All Feedback</h2>
            <p className="text-sm text-slate-500 mt-1">View and manage all submitted feedback</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
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
