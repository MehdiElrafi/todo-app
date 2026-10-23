# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- Start server: `bin/dev`
- Run migrations: `bin/rails db:migrate`
- Run seeds: `bin/rails db:seed`
- Rails console: `bin/rails c`

### Testing
- Run all tests: `bundle exec rspec`
- Run a single test file: `bundle exec rspec spec/path/to/file_spec.rb`
- Run specific test by line: `bundle exec rspec spec/path/to/file_spec.rb:line_number`

### Linting & Analysis
- RuboCop: `bin/rubocop`
- RuboCop auto-correct: `bin/rubocop -A`
- Brakeman security scan: `bin/brakeman`

## Architecture

This is a Ruby on Rails 8 API-first application providing a Todo/Task management system.

### Data Model
- **User**: Central identity; manages sessions and password resets.
- **Project**: Top-level container for organizational units.
- **List**: Belongs to a Project; groups related tasks.
- **Task**: The core unit of work; belongs to a List. Supports attachments (`has_many_attached`).
- **Label**: Categorization tool; associated with Projects and Tasks.
- **UserTask**: Join model for assigning tasks to users.

### Key Structures
- **Nested Routing**: The API follows a strict hierarchy: `Projects` $\rightarrow$ `Labels` / `Lists` $\rightarrow$ `Tasks`.
- **Authentication**: Handled via a custom `Authentication` concern in `ApplicationController` and a `Session` model.
- **Background Jobs**: Uses `Solid Queue` for database-backed job processing.
- **Storage**: Uses `Active Storage` for task file attachments.
- **Caching/Cable**: Uses `Solid Cache` and `Solid Cable` for database-backed caching and WebSockets.

### API Design
- Controllers are located in `app/controllers` and typically return JSON responses (likely utilizing Jbuilder or direct JSON rendering).
- Resourceful routing is heavily utilized for CRUD operations on projects, lists, and tasks.
