# BookEasy — Client Booking Dashboard

A full stack booking management app built with Next.js 13+, React, TypeScript, and Tailwind CSS.

## Features

- View available services
- Book an appointment
- Admin dashboard to view and manage all bookings
- REST API built with Next.js API Routes
- Data fetching with React Query

## Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Data Fetching:** React Query
- **Testing:** Jest + Playwright
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Page | URL |
|------|-----|
| Homepage | / |
| Services | /services |
| Book Appointment | /booking |
| Admin Dashboard | /admin |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/services | Get all services |
| GET | /api/bookings | Get all bookings |
| POST | /api/bookings | Create a new booking |

## Testing

Run unit tests:
```bash
npm test
```

Run end-to-end tests:
```bash
npx playwright test
```