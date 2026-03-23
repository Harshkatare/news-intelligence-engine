## Project Status

Current Version: v0.1 — Core Pipeline Established

This version focuses on a stable ingestion → enrichment → publishing flow.
Future versions will refine enrichment quality and ordering.

# Stock News Enrichment Platform

An AI-powered full-stack news intelligence platform that fetches stock-specific
market news, enriches it using AI, and delivers structured, investor-focused
content through a searchable web interface.

The system is built around a modular pipeline with admin-controlled ingestion
and enrichment flows.

## Features

### Backend

- Fetches latest stock-related news by symbol
- Stores raw and enriched news separately
- AI-powered content enrichment using Google Gemini
- Admin-controlled fetch & enrich flow
- Duplicate-safe ingestion
- Configurable enrichment limits

### Frontend

- Next.js app with modern App Router
- Home page with default market news
- Symbol-based search (e.g. AAPL, AMZN, IBM, META)
- News detail pages
- Pagination
- SEO metadata support

## AI Design

The platform uses Google Gemini to enrich raw financial news into structured,
investor-focused summaries and articles.

AI usage is controlled via configurable limits to ensure cost efficiency
and prevent excessive API usage.

A safe fallback mode is available where enrichment can be disabled.

## Tech Stack

**Backend**

- Node.js
- Express
- MongoDB (Atlas)
- Mongoose
- Axios

**Frontend**

- Next.js (App Router)
- TypeScript
- Fetch API

**AI**

- Google Gemini

## Project Structure

```
stock-news-platform/
├── server/
│   ├── src/
│   │   ├── app.js                # Express app entry
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic (AI, fetch, enrich)
│   │   ├── models/               # Mongoose models
│   │   ├── utils/                # Test scripts & helpers
│   │   └── config/               # App configuration
│   ├── .env                      # Local environment (NOT committed)
│   ├── .env.example              # Environment template
│   ├── package.json
│
│
├── client/
│   ├── app/                      # Next.js App Router pages
│   ├── components/               # UI components
│   ├── lib/                      # API & types
│   ├── public/
│   └── package.json
│
├── README.md
└── .gitignore
```

## How to Run (Local)

### 1️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend runs on: http://localhost:5000

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

-- Admin Flow:

Accessing the Admin Page
Start both backend and frontend servers.

** FRONTEND **  
Using the Admin Page

Enter a stock symbol
Example:
AAPL
AMZN
IBM
META

Fetch News: - Click Fetch - The system retrieves the latest raw news articles for that symbol

Enrich News (AI):

    - Click Enrich
    - The system processes the newest unenriched articles
    - AI enrichment runs with safety limits to control usage

View Results:

    - Enriched articles automatically appear on:
    - http://localhost:3000/
    - Click any article to open its detailed view

Open your browser and go to: http://localhost:3000/admin

** BACKEND **

Fetch raw news for a symbol
Enrich selected articles via AI
Enriched articles appear on frontend

```
API Usage:
    Get http://localhost:5000/api/news/search?symbol=AAPL
    POST http://localhost:5000/api/enrich/run, body:
    {
  "symbol": "AAPL"
  // "symbol": "AMZN"
  // "symbol": "META"
    }
```
