<div align="center">

# AI Job Tracker

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-7-white)
![Google AI](https://img.shields.io/badge/Google_Gemini-4385fc)

**An intelligent job application tracker that uses AI to extract structured data from job descriptions and helps job seekers organize their application pipeline.**

</div>

## Why This Project?

Job seekers often receive job descriptions in unstructured formats — emails, PDFs, LinkedIn posts, or plain text. Manually entering details like company name, salary range, required skills, and deadlines into spreadsheets or trackers is tedious and error-prone.

**APPLI-TRACT** solves this by letting users paste a job description and automatically extracting all relevant fields using Google's Gemini AI. The app then stores everything in a searchable, filterable dashboard with analytics to help users stay on top of their applications.

---

## Key Features

| Feature | Description |
|---|---|
| **AI Extraction** | Paste any job description and get structured data: title, company, location, salary, skills, responsibilities, qualifications, benefits, deadlines, and more. |
| **Multi-Model Selector** | Choose between different Google Gemini models (Gemini 2.5 Flash, Pro, etc.) for extraction. |
| **Confidence Scoring** | AI provides a confidence percentage for each extraction. |
| **Job Management** | Status tracking (applied, interview, offered, rejected), edit, delete, and filter jobs. |
| **Advanced Search & Filter** | Full-text search, filter by job type, work mode, and application status. |
| **Analytics Dashboard** | Bar charts for companies, pie charts for work mode/job type distribution, and stat cards. |
| **Authentication** | Secure sign-up/login with email and password via Better Auth. |
| **Data Persistence** | PostgreSQL database with Prisma ORM; auto-saves extraction results after login. |

---

## How It Works

1. **Paste** a job description into the textarea on the home page.
2. **Select** an AI model (default: Gemini 2.5 Flash).
3. Click **"Extract Job Information"** — the AI analyzes the text and returns structured JSON with confidence score.
4. **Review** the extracted fields: job title, company, salary range, skills, responsibilities, qualifications, benefits, deadlines, vacancies, etc.
5. **Save** the job to your personal dashboard (requires login).
6. **Manage** all saved jobs in the dashboard — update status, search, filter, and view analytics.

### Extraction Pipeline

```
Raw Job Description
        │
        ▼
  Gemini API (JSON mode)
        │
        ▼
  Normalization & Validation
        │
        ▼
  Structured JobExtraction object
        │
        ▼
  Database (Prisma + PostgreSQL)
```

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **AI**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) + [Kysely](https://kysely.dev/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Tables**: [TanStack React Table](https://tanstack.com/table)
- **Date Picker**: [React Day Picker](https://react-day-picker.js.org/)

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Google AI API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-job-tracker.git
cd ai-job-tracker

# Install dependencies
npm install
# or
bun install
# or
pnpm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_job_tracker?schema=public"
GEMINI_API_KEY="your_google_gemini_api_key"
BETTER_AUTH_SECRET="your_better_auth_secret"
```

### Database Migration

```bash
npx prisma migrate dev
npx prisma generate
```

### Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Project Structure

```
ai-job-tracker/
├── app/
│   ├── (auth)/                  # Login & Signup pages
│   ├── dashboard/               # Protected dashboard area
│   │   ├── create-job/          # Quick job creation page
│   │   ├── manage-jobs/         # Job management with datatable
│   │   ├── page.tsx             # Main dashboard (stats, charts)
│   │   └── layout.tsx           # Dashboard layout + sidebar
│   ├── layout.tsx
│   └── page.tsx                 # Home page (AI extraction)
├── actions/                     # Server actions
│   └── job/
│       └── job.action.ts
├── components/
│   ├── columns.tsx              # Table column definitions
│   ├── job-details.tsx          # Detailed job view
│   ├── job-extractor.tsx        # Main extraction client component
│   ├── model-selector.tsx       # AI model selection dropdown
│   ├── show-extracted-result.tsx
│   ├── barchart-company.tsx
│   ├── data-table.tsx
│   ├── navbar/                  # Public navbar
│   ├── app-sidebar.tsx          # Dashboard sidebar
│   └── skeleton/                # Loading skeletons
├── lib/
│   ├── ai/
│   │   ├── extraction.ts        # Gemini API integration + validation
│   │   ├── extraction-prompt.ts
│   │   └── normalization.ts      # Data normalization helpers
│   ├── services/
│   │   └── job-service.ts       # Server-side job CRUD operations
│   ├── auth.ts                  # Better Auth configuration
│   ├── prisma.ts                # Prisma client singleton
│   └── data/jobs.ts
├── prisma/
│   └── schema.prisma            # Database schema
├── types/
│   └── job-extraction.ts
└── package.json
```

---

## Features in Detail

### AI Extraction

The extraction engine uses Google's Gemini API with strict JSON response mode (`responseMimeType: 'application/json'`) and low temperature (0.1) for deterministic, reliable outputs. Extracted fields include:

- Job title, company name, location
- Work mode (Remote / Hybrid / On-site), Job type (Full-time / Part-time / Contract), Experience level
- Salary range (min, max, currency, negotiable)
- Skills, responsibilities, qualifications, benefits
- Application deadline, posting date, vacancies
- Source URL, raw text

### Dashboard

The dashboard provides a bird's-eye view of your job search:

- **Stat Cards**: Total jobs, interviews scheduled, offers received, response rate
- **Charts**: Company distribution (bar chart), work mode & job type breakdown (pie charts)
- **Job Table**: Sortable, searchable, filterable datatable with inline status updates

### Authentication

Powered by Better Auth with:

- Email & password registration
- Secure session management
- Auto-save of pending extractions after login

---

## Roadmap

- [ ] Company enrichment (auto-fetch company profile, tech stack, and background info)
- [ ] Resume matching (compare job requirements against user's resume)
- [ ] Email/Slack reminders for application deadlines
- [ ] CSV/PDF export of tracked jobs
- [ ] Dark mode polish
- [ ] Chrome extension for one-click extraction
- [ ] Mobile app (React Native)

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — feel free to use this project for personal or commercial purposes.

---

<div align="center">

Built with Next.js, React, TypeScript, Tailwind CSS, Prisma, and Google Gemini.

[Live Demo](https://appli-tract.vercel.app) · [Report Bug](https://github.com/forhadreza43/ai-job-tracker/issues) · [Request Feature](https://github.com/forhadreza43/ai-job-tracker/issues)

</div>
