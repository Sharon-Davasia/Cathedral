## Project Structure Overview

This document outlines the full folder and file hierarchy of the project, with brief descriptions, key files, environment variables, and relevant external dependencies. It serves as a quick reference for onboarding and debugging.

```text
./
├─ client/
│  ├─ env.example
│  ├─ index.html
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ src/
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ components/
│  │  │  ├─ Button.jsx
│  │  │  ├─ Input.jsx
│  │  │  ├─ Layout.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  └─ Sidebar.jsx
│  │  ├─ contexts/
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages/
│  │  │  ├─ Certificates.jsx
│  │  │  ├─ CreateTemplate.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ EditTemplate.jsx
│  │  │  ├─ GenerateCertificate.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Profile.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ Templates.jsx
│  │  │  └─ Users.jsx
│  │  ├─ services/
│  │  │  └─ api.js
│  │  └─ utils/
│  │     └─ cn.js
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ config/
│  └─ db.js
├─ controllers/
│  ├─ authController.js
│  ├─ certificateController.js
│  └─ userController.js
├─ docker-compose.yml
├─ Dockerfile
├─ env.example
├─ middleware/
│  ├─ auth.js
│  ├─ errorHandler.js
│  └─ upload.js
├─ models/
│  ├─ CertificateTemplate.js
│  ├─ IssuedCertificate.js
│  └─ User.js
├─ nginx.conf
├─ package.json
├─ README.md
├─ routes/
│  ├─ auth.js
│  ├─ certificates.js
│  └─ users.js
├─ scripts/
│  ├─ mongo-init.js
│  └─ seedAdmin.js
├─ server/
│  ├─ env.example
│  ├─ index.js
│  ├─ node_modules/
│  ├─ package-lock.json
│  └─ package.json
└─ utils/
   ├─ logger.js
   ├─ pdfGenerator.js
   └─ sendEmail.js
```

### Root Folder
- **Purpose**: Entry point for the monorepo, containing shared configs, root scripts, and documentation.
- **Key files**:
  - `package.json`: Root scripts to run client and server together (`npm run dev`), build client, start server, and seed DB. Uses `--prefix` flag to run scripts in respective directories. Depends on `concurrently` for multi-process dev.
  - `README.md`: Comprehensive setup instructions, environment configuration guidance, and quick start guide.
  - `structure.md`: This file - detailed project structure documentation.
  - `docker-compose.yml`: Optional local Docker development stack (MongoDB, app, optional Nginx reverse proxy). Maps volumes for `uploads/`, `certificates/`, and `logs/`.
  - `Dockerfile`: Multi-stage build configuration for containerizing the app service (includes both server and client build).
  - `nginx.conf`: Nginx reverse proxy configuration (optional service in compose).
- **Environment/Config Notes**:
  - **Root `.env` is NOT used by the app runtime.** Environment variables must be set in `client/.env` and `server/.env` separately.
  - `.gitignore` ignores `node_modules`, `.env` files, build outputs, logs, uploads, certificates, and common OS/IDE artifacts.
  - Users must copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env` and fill in values.
- **Root Scripts** (from `package.json`):
  - `npm run dev`: Runs both server and client in development mode using concurrently
  - `npm run server`: Starts only the backend server (dev mode)
  - `npm run client`: Starts only the frontend client (dev mode)
  - `npm run build`: Builds the frontend for production
  - `npm start`: Starts the backend server in production mode
  - `npm run seed`: Seeds the admin user
- **External Dependencies**:
  - Root dev dependency: `concurrently` (v8.2.2) to run client and server together
  - Note: Root `package.json` contains some dependencies that are primarily used by server/ - these may be removed in future cleanup

### client/
- **Purpose**: React frontend built with Vite and Tailwind CSS.
- **Key files**:
  - `package.json`: Frontend dependencies and scripts (`dev`, `build`, `preview`). Uses Vite and React 18.
  - `env.example`: Documents `VITE_API_URL` used by frontend to call backend API.
  - `index.html`: Vite HTML template.
  - `postcss.config.js`, `tailwind.config.js`: Tailwind and PostCSS configuration.
  - `vite.config.js`: Vite config (React plugin).
- **Environment/Config Notes**:
  - `VITE_API_URL` is required in `client/.env` (e.g., `http://localhost:5000/api`). Vite exposes it via `import.meta.env.VITE_API_URL`.
  - **Important**: Vite only exposes environment variables prefixed with `VITE_` to the browser for security.
  - Frontend runs on port 3000 by default (configured in `vite.config.js`).
  - Vite has a built-in proxy for `/api` routes pointing to `http://localhost:5000` during development.
  - Build outputs are ignored in `.gitignore` (e.g., `client/dist/`).
- **External Dependencies** (from `client/package.json`):
  - Runtime: `react`, `react-dom`, `react-router-dom`, `axios`, `react-hot-toast`, `react-hook-form`, `react-query`, `lucide-react`, `clsx`, `tailwind-merge`.
  - Dev: `@vitejs/plugin-react`, `vite`, `eslint` + react plugins, `tailwindcss`, `postcss`, `autoprefixer`.

#### client/src/
- **Purpose**: All frontend application code.
- `App.jsx`, `App.css`, `main.jsx`, `index.css`: App bootstrap and global styles.
- `components/`: Reusable UI components (buttons, inputs, layout, navigation, spinner).
- `contexts/`:
  - `AuthContext.jsx`: Authentication context (login/register/profile handling with token persistence and API integration).
- `pages/`: Route-level pages (dashboard, templates management, certificate generation, auth pages, users, profile).
- `services/`:
  - `api.js` (important): Axios instance configured with `baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`. Attaches token from `localStorage`, centralizes API calls for auth, certificates, and users.
- `utils/`:
  - `cn.js`: Classname utility (likely wraps `clsx`/Tailwind merges).

### server/
- **Purpose**: Express backend serving REST API endpoints, DB connection, security middleware, and static assets. Loads env with `dotenv`.
- **Key files**:
  - `index.js` (important): App bootstrap — loads `dotenv`, configures security (helmet, rate limiting), CORS (`CLIENT_URL`), body parsers, static directories (`/uploads`, `/certificates`), routes (`/api/...`), health check, 404, error handler, and starts server after DB connect.
  - `env.example` (important): Documents required server environment variables.
  - `package.json`: Backend dependencies and scripts (`dev` via `nodemon`, `start`, `seed`).
  - `package-lock.json`: Locked dependency versions.
- **Environment/Config Notes**:
  - **Required variables** (see `server/.env.example`):
    - `MONGO_URI` (MongoDB connection string) - **Required**
    - `JWT_SECRET` (JWT signing secret) - **Required** - must be changed in production
    - `CLIENT_URL` (CORS origin) - **Required** - must match frontend URL (default: http://localhost:3000)
    - `PORT` (server port, defaults to 5000 if missing)
    - `NODE_ENV` (development/production, defaults if missing)
  - **Optional variables**:
    - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` (for email functionality)
  - Environment validation: `server/config/db.js` validates required variables at startup and exits if missing.
  - Static directories served if present: `uploads`, `certificates` (created automatically on startup if missing).
- **External Dependencies** (from `server/package.json`):
  - Runtime: `express`, `cors`, `helmet`, `express-rate-limit`, `dotenv`, `jsonwebtoken`, `mongoose`, `multer`, `nodemailer`, `pdf-lib`, `bcryptjs`, `express-validator`, `mongodb-memory-server` (dev/testing utility).
  - Dev: `nodemon` for hot reload.

### config/
- **Purpose**: Shared configuration modules for backend.
- **Files**:
  - `db.js` (important): Exposes `connectDB()` which connects to MongoDB using `process.env.MONGO_URI` and logs connection host.
- **Environment/Config Notes**:
  - Uses `MONGO_URI` from `server/.env`.

### controllers/
- **Purpose**: Route controller logic for auth, certificates, and users.
- **Files**:
  - `authController.js`: Register/login/profile/password change; signs JWT using `process.env.JWT_SECRET`.
  - `certificateController.js`: Certificate template and generation logic (PDF, storage) — integrates with models/utils.
  - `userController.js`: Admin/staff user management.
- **Environment/Config Notes**:
  - Uses JWT secret and possibly email/client URL via utilities.

### routes/
- **Purpose**: Express routers mounting controller endpoints.
- **Files**:
  - `auth.js`: `/api/auth` endpoints for registration, login, profile management.
  - `certificates.js`: `/api/certificates` endpoints for templates, uploads, generate, downloads.
  - `users.js`: `/api/users` endpoints; likely protected/admin routes.

### middleware/
- **Purpose**: Shared request middleware for auth and error handling.
- **Files**:
  - `auth.js` (important): `authenticate`, `authorize`, and `optionalAuth` using JWT (`process.env.JWT_SECRET`).
  - `errorHandler.js`: Centralized error response formatting.
  - `upload.js`: Multer configuration for handling file uploads.
- **Environment/Config Notes**:
  - JWT secret, potentially other limits via env (if implemented inside these files).

### models/
- **Purpose**: Mongoose schemas and models.
- **Files**:
  - `CertificateTemplate.js`: Schema for certificate templates.
  - `IssuedCertificate.js`: Schema for generated/issued certificates.
  - `User.js`: Schema with password hashing and methods for authentication.
- **Environment/Config Notes**:
  - DB connection managed in `config/db.js`.

### utils/
- **Purpose**: Reusable utilities for logging, PDF generation, and email sending.
- **Files**:
  - `logger.js` (important): Logging utility used across server.
  - `pdfGenerator.js`: Generates certificates using `pdf-lib`.
  - `sendEmail.js` (important): Email sender using `nodemailer`. Reads SMTP env (`EMAIL_*`) and builds links using `CLIENT_URL`.
- **Environment/Config Notes**:
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and `CLIENT_URL` are consumed here.

### scripts/
- **Purpose**: Automation and setup scripts.
- **Files**:
  - `mongo-init.js`: Initializes MongoDB in Docker (users, db).
  - `seedAdmin.js` (important): Seeds default admin user; invoked via root `npm run seed`.
- **Environment/Config Notes**:
  - Uses DB connection and potentially default creds set in script or via env.

### docker-compose.yml
- **Purpose**: Compose stack for local development and optional reverse proxy.
- **Services**:
  - `mongodb`: MongoDB 7 container with root credentials, init script, and volume for data.
  - `app`: Node/Express app container with env for `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and mounts for `uploads`, `certificates`, `logs`.
  - `nginx` (optional): Reverse proxy mapping 80/443, serving static `uploads` and `certificates` as read-only.
- **Environment/Config Notes**:
  - Ensure `MONGO_URI` and `JWT_SECRET` are changed for production use.

### nginx.conf
- **Purpose**: Nginx proxy configuration for the optional `nginx` service, typically to route traffic to the app and serve static assets.

### package.json (root)
- **Purpose**: Workspace-level commands and dev tooling orchestration.
- **Scripts** (all use `--prefix` to run commands in respective directories):
  - `dev`: Runs both server and client concurrently using `concurrently` package.
  - `server`: Runs server in dev mode (`npm run dev --prefix server`).
  - `client`: Runs client in dev mode (`npm run dev --prefix client`).
  - `build`: Builds the frontend for production (`npm run build --prefix client`).
  - `start`: Starts the server in production mode (`npm start --prefix server`).
  - `seed`: Seeds admin user (`npm run seed --prefix server`).
- **Note**: The `--prefix` approach ensures proper working directory context and avoids path issues.

### Important Environment Variables (Quick Reference)

**Client** (`client/.env`):
- `VITE_API_URL` — Base URL for API calls (e.g., `http://localhost:5000/api`). **Required.**

**Server** (`server/.env`):
- `MONGO_URI` — MongoDB connection string. **Required.**
  - Local: `mongodb://localhost:27017/certifypro`
  - Docker: `mongodb://admin:password123@mongodb:27017/certifypro?authSource=admin`
- `JWT_SECRET` — JWT signing secret. **Required.** Must be changed in production.
- `CLIENT_URL` — Frontend URL for CORS (e.g., `http://localhost:3000`). **Required.**
- `PORT` — Server port (defaults to 5000).
- `NODE_ENV` — Environment (development/production).
- Optional email: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`.

### Setup Checklist
1. Copy `server/.env.example` to `server/.env` and fill in required values
2. Copy `client/.env.example` to `client/.env` and set `VITE_API_URL`
3. Ensure MongoDB is running
4. Run `npm install` in both `server/` and `client/` directories
5. Run `npm install` at root (for concurrently)
6. Start development: `npm run dev` (from root) or run server/client separately
7. Seed admin user: `npm run seed`

### Development Notes

**Starting the Application:**
- **Full stack**: `npm run dev` (from root) starts both server and client concurrently.
- **Separate**: Use `npm run server` and `npm run client` to run individually.
- Frontend runs on `http://localhost:3000` (configured in `client/vite.config.js`).
- Backend API runs on `http://localhost:5000/api`.
- Health check endpoint: `http://localhost:5000/api/health`.

**Environment Setup:**
- `server/.env` and `client/.env` **must be created** from their respective `.env.example` files before starting.
- Server validates required environment variables on startup and will exit if missing.
- Never commit `.env` files (already in `.gitignore`).

**Static Files:**
- Static directories (`uploads`, `certificates`) are created automatically by the server if missing.
- These directories are git-ignored by default and served by the backend.

**Docker Development:**
- Use `docker-compose up -d` to start all services (MongoDB, app, optional Nginx).
- Update environment variables in `docker-compose.yml` or use environment variable substitution.
- For Docker, `MONGO_URI` should use the service name: `mongodb://admin:password123@mongodb:27017/certifypro?authSource=admin`.
