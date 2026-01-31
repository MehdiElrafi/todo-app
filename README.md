# <img src="https://img.shields.io/github/v/tag/MehdiElrafi/todo-app?label=version" alt="version"> <img src="https://github.com/MehdiElrafi/todo-app/actions/workflows/rspec.yml/badge.svg?branch=main" alt="build"> <img src="https://img.shields.io/github/license/MehdiElrafi/todo-app" alt="license">  
# 📝 Todo App — Full Stack (Rails API + React Vite)

A simple, production-capable Todo management application:
- Back-end: Ruby on Rails (API-only), Rails ~8.0.2, Ruby 3.4.4
- Front-end: React (Vite), Tailwind CSS
- Database: PostgreSQL
- Tests: RSpec (back-end), Cypress (front-end E2E)
- CI/CD: GitHub Actions; deploy artifacts to Render (Rails) and Vercel (React)

---

## Features
- User session-based authentication (server-side sessions, cookies)
- Projects → Lists → Tasks nested resources (REST API)
- Labels per project and label association with tasks
- Production-ready Rails Docker image
- Test coverage integrated with Codecov (CI)
- E2E tests with Cypress and parallel execution in CI

---

## Table of contents
- Prerequisites
- Quickstart (local dev)
  - Back-end
  - Front-end
- Environment variables (examples)
- Running tests

---

## Prerequisites
- Git
- Ruby 3.4.4 (see back-end/.ruby-version)
  - Recommended: rbenv or rvm
- Node.js (>= 20.x) and npm (front-end package.json)
- PostgreSQL (local development)
- Optional: Docker (for production image)

---

## Quickstart — Development (recommended)

Clone repository:
```bash
git clone https://github.com/MehdiElrafi/todo-app.git
cd todo-app
```

### Back-end (Rails API)
1. Enter backend:
```bash
cd back-end
```

2. Install dependencies:
```bash
# Install bundler (if needed) and gems
gem install bundler
bundle install
```

3. Setup database and start dev server (bin/setup automates common tasks):
```bash
# This runs db:prepare, creates/migrates the DB and starts the dev server (unless --skip-server)
bin/setup
# or run setup without starting the server:
bin/setup --skip-server
# Start development server (uses honed settings)
bin/dev
```

Notes:
- bin/setup calls `bin/rails db:prepare` (create/migrate/load seeds).
- If you prefer manual:
  - `bundle exec rails db:create db:migrate db:seed`
  - `bin/dev` starts the configured dev server.

### Front-end (React + Vite)
Open a second terminal:

```bash
cd front-end
npm install
# create a local .env (see below) then run:
npm run dev
```

Default dev port is read from APP_PORT in vite.config.js (set in .env). The React app expects VITE_API_URL to point to the Rails API base URL (e.g. http://localhost:3000).

---

## Environment variables

Back-end (examples; put in your dev environment or export before starting):
```
# back-end example (export or use direnv)
RAILS_ENV=development
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_PORT=5432
BACK_END_DATABASE_PASSWORD=...   # used in production database.yml if configured
FRONT_END_URL=http://localhost:5173
RAILS_MASTER_KEY=your_master_key_here  # required when running Rails in production or the Docker image
```

Front-end (.env file inside front-end/):
```
# front-end/.env
VITE_API_URL=http://localhost:3000    # Rails API base URL (no trailing slash preferred)
APP_PORT=5173                         # Dev port used by Vite
```

Important:
- CORS is configured in back-end/config/initializers/cors.rb and uses FRONT_END_URL (defaults to http://localhost:5173).
- The front-end API client (front-end/src/services/apiClient.js) sends credentials: 'include' (cookies). Make sure backend session cookies are allowed and FRONT_END_URL and VITE_API_URL are set consistently.

---

## Running tests

Back-end (RSpec)
```bash
# from repository root or back-end folder
cd back-end
# Ensure test DB exists and migrations applied:
RAILS_ENV=test bundle exec rails db:create db:migrate
bundle exec rspec
```

Front-end (Cypress)
```bash
cd front-end
npm install
# Open interactive runner:
npm run cy:open
# or headless:
npm run e2e:chrome
# or:
npx cypress run --browser chrome
```

CI:
- GitHub Actions runs back-end RSpec (/.github/workflows/rspec.yml) and front-end Cypress tests (/.github/workflows/cypress.yml). The CI expects several repository secrets for deploy/recording (see your workflows).
