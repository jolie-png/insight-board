import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all feedback
  app.get("/api/feedback", async (req, res) => {
    try {
      const { status, category, search, startDate, endDate } = req.query;
      
      let feedback = await storage.getAllFeedback();
      
      if (status && typeof status === 'string') {
        feedback = await storage.getFeedbackByStatus(status);
      }
      
      if (category && typeof category === 'string') {
        feedback = await storage.getFeedbackByCategory(category);
      }
      
      if (search && typeof search === 'string') {
        feedback = await storage.searchFeedback(search);
      }
      
      if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
        feedback = await storage.getFeedbackByDateRange(new Date(startDate), new Date(endDate));
      }
      
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Get feedback by ID
  app.get("/api/feedback/:id", async (req, res) => {
    try {
      const feedback = await storage.getFeedback(req.params.id);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Create new feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  // Update feedback
  app.patch("/api/feedback/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const feedback = await storage.updateFeedback(req.params.id, { status });
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to update feedback" });
    }
  });

  // Delete feedback
  app.delete("/api/feedback/:id", async (req, res) => {
    try {
      const success = await storage.deleteFeedback(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete feedback" });
    }
  });

  // Get analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      const allFeedback = await storage.getAllFeedback();
      
      const totalFeedback = allFeedback.length;
      const pendingReview = allFeedback.filter(f => f.status === 'new').length;
      
      // Category breakdown
      const categoryBreakdown = allFeedback.reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Sentiment breakdown
      const sentimentBreakdown = allFeedback.reduce((acc, f) => {
        acc[f.sentiment || 'neutral'] = (acc[f.sentiment || 'neutral'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Status breakdown
      const statusBreakdown = allFeedback.reduce((acc, f) => {
        acc[f.status] = (acc[f.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Trends data (last 7 days)
      const now = new Date();
      const trends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayFeedback = allFeedback.filter(f => {
          const createdAt = new Date(f.createdAt);
          return createdAt >= dayStart && createdAt <= dayEnd;
        });
        
        trends.push({
          date: dayStart.toISOString().split('T')[0],
          total: dayFeedback.length,
          resolved: dayFeedback.filter(f => f.status === 'resolved').length
        });
      }

      const satisfactionScore = sentimentBreakdown.positive ? 
        ((sentimentBreakdown.positive * 5 + (sentimentBreakdown.neutral || 0) * 3 + (sentimentBreakdown.negative || 0) * 1) / totalFeedback).toFixed(1)
        : '0.0';
      
      res.json({
        totalFeedback,
        pendingReview,
        avgResponseTime: '2.3 days',
        satisfactionScore: satisfactionScore + '/5',
        categoryBreakdown,
        sentimentBreakdown,
        statusBreakdown,
        trends
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
