# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Format: `npm run format`
- E2E Tests (Chrome): `npm run e2e:chrome`
- Open Cypress UI: `npm run cy:open`

## Architecture
The project is a React application built with Vite and Tailwind CSS.

### Key Structure
- `src/components/`: UI components divided by domain:
  - `auth/`: Authentication related components (LoginForm, Dashboard, ProfileDropdown).
  - `kanban/`: Kanban board implementation.
- `src/contexts/`: React Contexts for global state management (e.g., `AuthContext.jsx`).
- `src/hooks/`: Custom React hooks (e.g., `useAuth.js`).
- `src/services/`: API interaction logic. `apiClient.js` provides a wrapper around the Fetch API with support for credentials (cookies) and environment-based base URLs (`VITE_API_URL`).
- `cypress/`: End-to-end testing suite using Cypress.

### Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Testing**: Cypress
- **Linting/Formatting**: ESLint & Prettier
