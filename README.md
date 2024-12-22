# Syrups

_TODO_

## Prereqs

- [asdf](https://asdf-vm.com/guide/getting-started.html): v0.14.1 tested; runtime manager (optional)
- [Node](https://nodejs.org/en/download/package-manager): v22.9.0; JavaScript runtime
- [PNPM](https://pnpm.io/installation): v9.12.1; Package manager

## Getting Started

```bash
# Optional; skip if nodejs and pnpm are installed via other ways
asdf install

# Install project dependencies
pnpm install

# Set up database
pnpm run db:generate
pnpm run db:push

# Start dev server
pnpm start

# Testing
pnpm test
pnpm test:watch
```
