# Rave UI Prototype

Interactive React prototype for the Rave request management dashboard.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## What's in Here

- **Interactive UI** for testing request management flows
- **TypeScript data models** matching `../docs/02-data-structure.md`
- **Mock data** with 3 sample requests
- **Reusable React components** ready to integrate into the real app

## Component Organization

```
src/
├── components/
│   ├── RequestCard.tsx                # Summary card for each request
│   ├── RequestDetail.tsx              # Full detail modal
│   ├── MessagesSection.tsx           # Messages & cadence
│   ├── ReviewFeedbackSection.tsx      # Emoji + feedback text
│   ├── ReferralDataSection.tsx        # Referrer input & variants
│   └── OutcomeSection.tsx             # Completion tracking
├── types.ts                           # TypeScript interfaces
├── mockData.ts                        # Sample data
└── App.tsx                            # Main app
```

## Integration with Real App

The components and types here are copy-paste ready. Just swap mock data for real API calls and integrate into your React Native or web app.
