import { type Feedback, type InsertFeedback } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getFeedback(id: string): Promise<Feedback | undefined>;
  getAllFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  updateFeedback(id: string, updates: Partial<Feedback>): Promise<Feedback | undefined>;
  deleteFeedback(id: string): Promise<boolean>;
  getFeedbackByDateRange(startDate: Date, endDate: Date): Promise<Feedback[]>;
  getFeedbackByStatus(status: string): Promise<Feedback[]>;
  getFeedbackByCategory(category: string): Promise<Feedback[]>;
  searchFeedback(query: string): Promise<Feedback[]>;
}

function analyzeSentiment(message: string): string {
  const positiveWords = ['love', 'great', 'awesome', 'excellent', 'amazing', 'perfect', 'fantastic', 'wonderful'];
  const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'horrible', 'worst', 'broken', 'useless', 'issue', 'problem', 'bug'];
  
  const lowerMessage = message.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

export class MemStorage implements IStorage {
  private feedback: Map<string, Feedback>;

  constructor() {
    this.feedback = new Map();
  }

  async getFeedback(id: string): Promise<Feedback | undefined> {
    return this.feedback.get(id);
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const now = new Date();
    const sentiment = analyzeSentiment(insertFeedback.message);
    
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      userEmail: insertFeedback.userEmail || null,
      priority: insertFeedback.priority || "medium",
      status: "new",
      sentiment,
      createdAt: now,
      updatedAt: now,
    };
    
    this.feedback.set(id, feedback);
    return feedback;
  }

  async updateFeedback(id: string, updates: Partial<Feedback>): Promise<Feedback | undefined> {
    const existing = this.feedback.get(id);
    if (!existing) return undefined;

    const updated: Feedback = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.feedback.set(id, updated);
    return updated;
  }

  async deleteFeedback(id: string): Promise<boolean> {
    return this.feedback.delete(id);
  }

  async getFeedbackByDateRange(startDate: Date, endDate: Date): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter(f => {
      const createdAt = new Date(f.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });
  }

  async getFeedbackByStatus(status: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter(f => f.status === status);
  }

  async getFeedbackByCategory(category: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter(f => f.category === category);
  }

  async searchFeedback(query: string): Promise<Feedback[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.feedback.values()).filter(f =>
      f.message.toLowerCase().includes(lowerQuery) ||
      f.userName.toLowerCase().includes(lowerQuery) ||
      f.category.toLowerCase().includes(lowerQuery)
    );
  }
}

export const storage = new MemStorage();
