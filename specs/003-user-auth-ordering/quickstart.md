# Quickstart: User Auth & Cabin Ordering

This guide provides steps to boot the project with the new auth and ordering features.

## Prerequisites
- Node.js 18+
- npm install

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Local Storage (Automated)**
   - The application will automatically check for `src/assets/users.json` and `src/assets/schedules.json` on first run.
   - It will populate LocalStorage with the default 5 users and 30 schedules (all with inventory: 99).

3. **Login credentials**
   - Use any of the 5 default users in `src/assets/users.json`. 
   - Example: `admin` / `password123` (depending on the generated seed).

4. **Testing the Order Flow**
   - Go to "Schedules" (requires login).
   - Find a schedule and click "Purchase".
   - Go to "My Orders" to see your history.

## Development Tasks
- `npm run dev`: Start Vite dev server.
- `npm run test`: Run Vitest suites for auth and storage logic.
