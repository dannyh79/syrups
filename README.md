# Syrups

A portal to register employees and for employees to fill out assigned performance reviews.

## Usage

### Admin User

1. Access the website, click "Click here to start" to navigate to sign-in page
2. Click "Create an account" to create an user account
3. From "Account" in sidebar, navigate to account page to fill out the name and change role to `admin`
4. From sidebar, create some employee records
5. From sidebar, create some performance review records

### Default User

1. Click "Click here to start" to navigate to sign-in page
2. Click "Create an account", and use one of employee emails to create an user account
3. From sidebar, fill out the pending performance review records

### Signing Out

6. From "Home" in sidebar, click "Sign out"

## Design

### (Business) Domains

- Users
- Employees
- Performance reviews

### Relationships

#### Users and Employees

- An user record is associated with an employee record by email. This allows admins to create pending performance reviews without having to create their user account in the first place

#### Users (Employees) and Performance Reviews

- An admin user can view all performance reviews, and create (pending) reviews for employees to fill out
- A default user can ONLY update (edit) existing incomplete performance reviews

### Tech Stack

- TypeScript
- Front-end: Next.js with ShadCN UI
- Back-end: Next.js route handlers
- Database: SQLite; Easy to set up for PoCs

## Getting Started

### Prereqs

- [asdf](https://asdf-vm.com/guide/getting-started.html): v0.14.1 tested; runtime manager (optional)
- [Node](https://nodejs.org/en/download/package-manager): v22.9.0; JavaScript runtime
- [PNPM](https://pnpm.io/installation): v9.12.1; Package manager

```bash
# Optional; skip if nodejs and pnpm are installed via other ways
asdf install

# Install project dependencies
pnpm install

# Set up database
pnpm run db:generate
pnpm run db:push

# Start server
pnpm build & pnpm start

# Testing
pnpm test
pnpm test:watch
```

## Assumptions

### Domains

#### Users

- An admin user can be "demoted" to a default user
- (Not implemented) A default user can request current admin "promoted" the user as an admin

#### Employees

- Optional last name field: [Last names are not used in some countries](https://en.wikipedia.org/wiki/Mononym)
- Optional role field: This is to annotate an employee's position in the org. Could be an array field in database

#### Performance Reviews

- Same employee for both employee field and assinee field: By design; assume self-review is practiced
- Default users (employees) can only see pending reviews: Assume they only need to check for the pending ones

### Infrastructure

#### Performance Reviews

- For possible audit purposed, records are not deleted when associated employee record is destroyed

## Possible Improvements

### Storage

- Soft deletion: Could leverage soft deletion for audit/security purposes
- Documentation: ERD, etc

### Back-end

- Testing
  - Use ORM with actual database to reflect real database transactions
  - Use factory libraries to generate stub records
- RBAC: Could authenticate to enforce complete control of REST endpoints
- Documentation: Could add SwaggerUI
- Caching: Could cache session and some frequently-accessed resources
- Demo: Could pre-populate data for demo purposes

### Front-end

- E2E tests on commonly supported browsers
- Caching: Could cache session and some frequently-accessed resources
