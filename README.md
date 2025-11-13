# GoDaddy Repository Browser

A React + TypeScript web application that displays a list of GoDaddy's public repositories from GitHub with detailed information about each repo.

## Features

**Repository List** — Browse GoDaddy's repositories with pagination  
 **Repository Details** — View comprehensive information about any repository including:

- Repository title and description
- Language used
- Number of stars, forks, watchers, and open issues
- Direct link to the GitHub repository page
- Public/Private visibility status

  **Fully Tested** — Unit tests for all components using Jest + React Testing Library  
  **TypeScript** — Full type safety across the codebase  
  **Responsive UI** — Works on desktop and mobile devices

## Tech Stack

- **React 19**

Quick start

1. Install

```bash
yarn install
```

2. Run dev server

```bash
yarn run dev
# open http://localhost:5173
```

3. Run tests

```bash
yarn run test
```

Notes

- Tests use Jest + React Testing Library. There are tests for components and the main hook.
- Axios is used for API calls, pagination is derived from GitHub's Link header.

Why this setup

- Vite : for fast dev feedback
- TypeScript : for safer refactors
- React Testing Library and Jest : for UI-focused tests

What could be improved / skipped due to time constraints

- caching layer (React Query) — data is fetched on navigation
- search or filtering feature
