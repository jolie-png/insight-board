import FeedbackForm from "@/components/feedback/feedback-form";
import { useToast } from "@/hooks/use-toast";

export default function SubmitFeedback() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Thank you for your feedback! We'll review it shortly.",
    });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Submit Feedback</h2>
            <p className="text-sm text-slate-500 mt-1">Share your thoughts and help us improve</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <FeedbackForm onSuccess={handleSuccess} />
      </div>
    </>
  );
}
