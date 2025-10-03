# Architecture Decisions

Just documenting some key decisions I made while building this.

## Why Zustand instead of Context?

**The problem**: Needed state management for teams, loading states, and errors. React Context was the obvious choice but it's kind of annoying to use.

**What I did**: Went with Zustand instead.

**Why**: Context requires a lot of setup - create context, provider wrapper, consumer hooks. Zustand is just create store and use it. Also Context re-renders everything when any value changes, Zustand only updates what you actually use.

**Trade-offs**: Had to learn Zustand, but it's pretty simple. Still need a provider wrapper for React, but that's just a few lines.

## Pagination vs Virtualization

**The problem**: Got 520 teams to display. Should I virtualize the table or just paginate?

**What I did**: Simple pagination.

**Why**: 520 items is manageable without virtualization. Pagination is simpler to implement, more familiar to users, and works better with search/filtering. For a data table like this, pagination is the right choice.

**Trade-offs**: Uses more memory since all data is loaded, but for this size it doesn't matter. Would need to rethink if we had 10k+ items.

## Zod for validation

**The problem**: Need to validate forms and keep types in sync.

**What I did**: Used Zod schemas.

**Why**: It's nice having one source of truth for validation. The TypeScript integration is solid, types are automatically inferred from schemas. Way better than writing custom validators.

**Trade-offs**: Adds some bundle size, but the DX improvement is worth it.

## Mock API in the store

**The problem**: Need to simulate API calls for development and testing.

**What I did**: Built the mock API directly into the Zustand store.

**Why**: No need to set up a separate mock server. Easy to add delays and simulate errors. Works great with tests.

**Trade-offs**: Only works for this app, but that's fine for now.
