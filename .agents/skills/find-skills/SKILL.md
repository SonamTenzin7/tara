---
name: find-skills
description: A comprehensive Developer Toolbox for finding skills, web development, code quality, design, and productivity. Helps users discover and install agent skills while providing direct assistance in core engineering domains.
---

# Developer Toolbox

This skill is your primary resource for software engineering best practices, design principles, and skill discovery.

## 1. Skill Discovery & Installation

The Skills CLI (`npx skills`) is the package manager for the open agent skills ecosystem.

- `npx skills find [query]` - Search for skills by keyword.
- `npx skills add <package>` - Install a skill (e.g., `npx skills add vercel-labs/skills@find-skills`).
- `npx skills list` - List installed skills.
- `npx skills check/update` - Manage updates.

**Recommended Sources:** `vercel-labs`, `anthropics`, `microsoft`, `google-labs-code`.

## 2. Web Development (Modern Stack)

Always prioritize performance, accessibility, and clean architecture.

### React & Next.js
- **Server Components**: Use RSCs by default for data fetching to reduce bundle size.
- **Client Components**: Use `"use client"` only for interactivity (state, effects, event listeners).
- **Hooks**: Prefer `useMemo` and `useCallback` only when performance profiling proves necessary.
- **Data Fetching**: Use `Suspense` for loading states and `error.js` for error boundaries.

### CSS & Styling
- **Vanilla CSS**: Use CSS Variables (Tokens) for theme management.
- **Tailwind CSS**: Follow a mobile-first approach. Use `cn()` utility for conditional classes.
- **Layouts**: Use Flexbox for components and Grid for page layouts.

## 3. Code Quality & Testing

Maintain a robust, bug-resistant codebase.

### Testing Strategy
- **Unit Tests**: Use Jest/Vitest for logic and utility functions.
- **Component Tests**: Use React Testing Library to test user interactions, not implementation details.
- **E2E Tests**: Use Playwright/Cypress for critical user flows (e.g., checkout, login).
- **TDD**: Write tests before implementation for complex logic to ensure edge cases are handled.

### Best Practices
- **Linting**: Strict ESLint rules (Airbnb or Next.js core-web-vitals).
- **Code Reviews**: Look for readability, scalability, and security (OWASP Top 10).
- **Refactoring**: Follow DRY (Don't Repeat Yourself) but prefer "A little duplication is better than a little wrong abstraction."

## 4. Design & UX

Create premium, high-fidelity user experiences.

- **Typography**: Use modern sans-serif fonts (Inter, Roboto, Outfit). Ensure 4.5:1 contrast ratio.
- **Visuals**: Use gradients, glassmorphism, and subtle micro-animations (Framer Motion).
- **Responsiveness**: Design for all breakpoints using `@media` or Tailwind's responsive prefixes.
- **Accessibility**: Use semantic HTML (`<main>`, `<nav>`, `<section>`). Ensure all interactive elements have `aria-label` where needed.

## 5. Productivity & Workflow

Optimize for speed and reliability.

- **Git**: Use meaningful commit messages (Conventional Commits: `feat:`, `fix:`, `chore:`).
- **Branching**: Follow Git Flow or Trunk Based Development.
- **Terminal**: Use aliases for frequent commands. Automate repetitive tasks with shell scripts.
- **CI/CD**: Ensure every PR triggers automated tests and linting.

---

### Common Skill Categories for `npx skills find`

| Category | Queries |
| :--- | :--- |
| **Web Dev** | react, nextjs, typescript, tailwind, graphql |
| **Testing** | jest, playwright, cypress, vitest |
| **DevOps** | docker, kubernetes, aws, vercel, github-actions |
| **Code Quality** | eslint, prettier, sonar, audit |
| **Productivity** | zsh, git-hooks, shortcuts, automation |
