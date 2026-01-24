# Final Premium — Deployment Readme

This repository contains a split frontend (client) and backend (server) setup optimized for Netlify (frontend) and Railway (backend) deployments.

Top-level structure

final-premium/
- client/ (React + Vite) — build and deploy to Netlify
- server/ (Express + Firebase Admin) — deploy to Railway or any Node host
- firebase/ (firestore.rules) — Firestore rules for deployment

Important notes

- Do NOT commit or expose server service account files. The server may use `server/service-account.json` locally, but in production provide credentials via environment variables (FIREBASE_SERVICE_ACCOUNT).
- Root-level node_modules have been removed. Install dependencies separately in `client/` and `server/` when preparing deployment.

Quick commands

From repository root:

1) Frontend build (Netlify will run this using netlify.toml):

```powershell
cd .\client
npm install
npm run build
```

2) Backend (Railway):

```powershell
cd ..\server
npm install
npm start
```

3) Linting / tests: run inside each package as appropriate.

Netlify config

- `netlify.toml` is configured to install & build the client and publish `client/build`.

Railway config

- Deploy the `server/` directory as the project root on Railway and set necessary environment variables:
  - `PORT` (optional)
  - `FIREBASE_SERVICE_ACCOUNT` (JSON string) or set up integration with GCP service account.
  - `FIREBASE_PROJECT_ID` (optional)

Security

- `.gitignore` is provided to prevent accidental commits of secrets. Verify any CI/CD secrets are stored in the provider's secret manager.
