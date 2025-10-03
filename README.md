# Bazara Tech - Team Management

A team management app built with Next.js 15 and React 19. Pretty straightforward CRUD interface with filtering, sorting, and pagination.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

That's it. Runs on http://localhost:3000

## Project Structure

```
src/
├── app/                 # Next.js app router stuff
├── components/          # Reusable UI components
├── data/               # Mock data
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── module/             # Feature modules
├── schema/             # Zod validation schemas
├── store/              # Zustand state management
└── types/              # TypeScript types
```

## How it works

### State Management

Using Zustand for state management. The store handles all the team CRUD operations:

```typescript
// Store setup
const store = createStore<TeamStore>()(
  devtools(
    (set, get) => ({
      teams: [],
      loading: false,
      error: null,
      createTeam: async (data) => {
        /* ... */
      },
      updateTeam: async (data) => {
        /* ... */
      },
      deleteTeam: async (id) => {
        /* ... */
      },
    }),
    { name: "team-store" }
  )
);
```

Wrapped it in a React provider so components can use it:

```typescript
const useTeamStore = <T>(selector: (store: TeamStore) => T): T => {
  const context = useContext(TeamStoreContext);
  if (!context) throw new Error("useTeamStore must be used within provider");
  return useStore(context, selector);
};
```

### Pagination

Simple pagination hook that slices the data:

```typescript
const usePagination = <T>(data: T[], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return { currentPage, totalPages, paginatedData, setCurrentPage };
};
```

### Form Validation

Using Zod for validation. One schema defines both validation rules and TypeScript types:

```typescript
const teamSchema = z.object({
  name: z.string().min(1, "Required").max(100, "Too long"),
  description: z.string().min(10, "At least 10 chars"),
  code: z.string().regex(/^[A-Z]{2,4}\d{3}$/, "Invalid format"),
  email: z.string().email("Invalid email"),
  // ... etc
});

type CreateTeamData = z.infer<typeof teamSchema>;
```

### Mock API

The "API" is just async functions in the Zustand store that simulate network delays:

```typescript
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

createTeam: async (data) => {
  set({ loading: true });
  await simulateDelay(); // Fake network delay

  const newTeam = { id: `team-${Date.now()}`, ...data };
  set((state) => ({ teams: [newTeam, ...state.teams], loading: false }));
  return newTeam;
};
```

To test error handling, you can uncomment this in the store:

```typescript
// Simulate random failures
if (Math.random() < 0.3) {
  reject(new Error("API failure"));
}
```

## Testing

### React 19 Compatibility & Testing Strategy

The project uses **React 19**, which has compatibility issues with React Testing Library. To work around this, we focus on testing the core business logic and utilities that don't require component rendering.

### Current Test Coverage

#### ✅ What We Test

**Core Business Logic**

- **Team Utilities** (`src/lib/teamUtils.ts`)
  - Filtering, sorting, pagination functions
  - Team code validation
  - Edge cases and error handling

**Data Management**

- **Zustand Store** (`src/store/teamStore.ts`)
  - CRUD operations
  - State management
  - Error handling
  - Loading states

**Schema Validation**

- **Zod Schemas** (`src/schema/team.schema.ts`)
  - Data validation
  - Type checking
  - Error messages

**Utility Functions**

- **Class Utilities** (`src/lib/utils.ts`)
  - Class name merging
  - Tailwind CSS utilities

**Data Generation**

- **Mock Data** (`src/data/teams.ts`)
  - Team generation functions
  - Data consistency

**UI Components**

- **Button Component** (`src/components/ui/button.tsx`)
  - Basic rendering and props

#### ❌ What We Don't Test (Due to React 19 Issues)

- Complex component interactions
- Form submissions with React Hook Form
- Modal dialogs and user interactions
- Table rendering and pagination UI
- Navigation components

### Test Structure

```
src/
├── components/__tests__/
│   └── button.test.ts          # Button component tests
├── data/__tests__/
│   └── teams.test.ts           # Mock data tests
├── lib/__tests__/
│   ├── teamUtils.test.ts       # Team utility tests
│   └── utils.test.ts           # General utility tests
├── schema/__tests__/
│   └── team.schema.test.ts     # Zod schema tests
└── store/__tests__/
    └── teamStore.test.ts       # Zustand store tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Results

Run `npm run test:coverage` to see current test results and coverage.

### Testing Strategy

1. **Unit Tests**: Test individual functions in isolation
2. **Integration Tests**: Test store operations and data flow
3. **Type Safety**: Validate TypeScript interfaces and Zod schemas
4. **Edge Cases**: Test error conditions and boundary values

### Future Improvements

When React Testing Library supports React 19:

- Add component integration tests
- Test form interactions
- Test modal dialogs
- Test table pagination UI
- Add end-to-end user flow tests

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (state)
- Zod (validation)
- React Hook Form
- Radix UI components
- Jest + Testing Library

## Mock Data

Generates 520 fake teams with realistic data:

- 20 Nigerian banks as entities
- 15 different managers
- Mix of Active/Inactive statuses
- Deterministic generation (same data every time)

## Deployment

```bash
npm run build
npx vercel
```

Pretty standard Next.js deployment.

## Docs

- [ADR.md](./ADR.md) - Architecture decisions
