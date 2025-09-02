# InsightBoard - User Feedback Management System

Hi there!! InsightBoard is a full-stack web application for collecting, analyzing, and managing user feedback. Built with React, Node.js, and TypeScript, it’s designed to showcase modern web development and product thinking, helping teams use feedback loops to improve their products.

---

## What It Does

InsightBoard lets users submit feedback via a simple form and provides product managers with a dashboard to track, categorize, and respond to that feedback.

---

## Key Features

- **Feedback Submission**: Clean form with validation and categorization
- **Analytics Dashboard**: Real-time charts showing feedback trends and sentiment
- **Smart Filtering**: Search and filter by status, category, or keywords
- **Sentiment Analysis**: Automatically detects positive, negative, or neutral feedback
- **Responsive Design**: Works great on desktop and mobile
- **Status Workflow**: Track feedback from "New" → "In Progress" → "Resolved"

---

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- React Query for state management
- React Hook Form + Zod for validation

### Backend
- Node.js + Express (TypeScript)
- RESTful API design
- In-memory storage (upgradeable to PostgreSQL)
- Drizzle ORM for database operations

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
git clone https://github.com/jolie-png/insight-board.git
cd insight-board
npm install
npm run dev
```
Open your browser to [http://localhost:5000](http://localhost:5000).

Both frontend and backend run simultaneously.

---

## How to Use

### For Users (Submitting Feedback)
1. Go to "Submit Feedback"
2. Fill out the form
3. Choose a category (Bug Report, Feature Request, etc.)
4. Select priority level
5. Hit submit!

### For Product Managers (Dashboard)
- **Dashboard**: See overall metrics and trends
- **All Feedback**: Manage individual feedback items
- **Analytics**: Dive deeper into charts and data

Use action buttons to move feedback through the workflow:
-  View: Mark as "In Progress"
-  Edit: Mark as "In Progress"
-  Resolve: Mark as "Resolved"

---
