# Squants Papers - Microservices Architecture

A production-ready, scalable academic paper sharing platform built with microservices architecture.

## 🚀 Features

- **Microservices Architecture**: Independent, scalable services
- **Containerized**: Docker & Docker Compose support
- **Kubernetes Ready**: Production-grade orchestration with auto-scaling
- **Secure**: JWT authentication, rate limiting, network policies
- **High Performance**: Redis caching, connection pooling, optimized queries
- **Production Grade**: Health checks, logging, monitoring, graceful shutdown

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (Next.js)
│  Port 3001  │
└──────┬──────┘
       │
┌──────▼──────────┐
│  API Gateway    │ (Express + Auth + Rate Limiting)
│   Port 3000     │
└────┬─────┬──────┘
     │     │
     │     ├───────────┐
     │     │           │
┌────▼─────▼─┐  ┌─────▼────────┐  ┌────────────┐
│   Papers   │  │    ArXiv     │  │  Comments  │
│  Service   │  │   Service    │  │  Service   │
│  Port 4001 │  │  Port 4002   │  │ Port 4003  │
└────┬───────┘  └──────┬───────┘  └─────┬──────┘
     │                 │                 │
┌────▼─────────────────▼─────────────────▼──────┐
│         PostgreSQL      │       Redis         │
│         Databases       │       Cache         │
└─────────────────────────┴─────────────────────┘
```

## 📋 Services

| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| Frontend | 3001 | Next.js UI | - |
| API Gateway | 3000 | Auth, routing, rate limiting | Redis |
| Papers Service | 4001 | Paper management | PostgreSQL |
| ArXiv Service | 4002 | External API integration | Redis |
| Comments Service | 4003 | Comment management | PostgreSQL |

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation (Joi)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Non-root container users
- ✅ Kubernetes Network Policies
- ✅ Secret management

## 📈 Scalability Features

- ✅ Horizontal auto-scaling (HPA)
- ✅ Load balancing
- ✅ Redis distributed caching
- ✅ Database connection pooling
- ✅ Independent service scaling
- ✅ Stateless services

## 🚀 Quick Start

### Using Docker Compose

```bash
# Clone and navigate
cd d:\squants

# Copy environment file
copy .env.docker .env

# Start all services
docker-compose up --build

# Access
# Frontend: http://localhost:3001
# API: http://localhost:3000
```

### Using Kubernetes

```powershell
# Build images
.\scripts\build-images.ps1

# Deploy
.\scripts\deploy-k8s.ps1

# Check status
kubectl get pods
kubectl get services
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide with examples

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Cache**: Redis 7
- **Validation**: Joi

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18
- **Styling**: Tailwind CSS

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Proxy**: http-proxy-middleware
- **Security**: Helmet.js, CORS
- **Logging**: Winston

## 📊 API Endpoints

### Papers
- `POST /api/papers` - Create paper
- `GET /api/papers` - List papers
- `GET /api/papers/:id` - Get paper
- `PUT /api/papers/:id` - Update paper
- `DELETE /api/papers/:id` - Delete paper

### ArXiv
- `POST /api/arxiv/lookup` - Lookup ArXiv metadata

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/paper/:paperId` - Get paper comments
- `DELETE /api/comments/:id` - Delete comment

## 🔧 Development

### Prerequisites
- Node.js 20+
- Docker Desktop
- PostgreSQL 16 (optional)

### Setup Service

```bash
cd services/api-gateway
npm install
npm run dev
```

## 🎯 Production Deployment

### Build Images

```powershell
.\scripts\build-images.ps1 v1.0.0 your-registry
```

### Push to Registry

```powershell
.\scripts\push-images.ps1 v1.0.0 your-registry
```

### Deploy to Kubernetes

```powershell
.\scripts\deploy-k8s.ps1
```

## 📦 Project Structure

```
squants/
├── services/
│   ├── api-gateway/       # API Gateway service
│   ├── papers-service/    # Papers microservice
│   ├── arxiv-service/     # ArXiv integration service
│   └── comments-service/  # Comments microservice
├── k8s/                   # Kubernetes manifests
├── scripts/               # Deployment scripts
├── src/                   # Frontend source
├── docker-compose.yml     # Local development
└── ARCHITECTURE.md        # Detailed documentation
```

## 🔍 Monitoring

### Health Checks
All services expose `/health`:
```bash
curl http://localhost:3000/health
```

### Logs
```bash
# Docker Compose
docker-compose logs -f api-gateway

# Kubernetes
kubectl logs -f deployment/api-gateway
```

## 🐛 Troubleshooting

See [QUICKSTART.md](./QUICKSTART.md) for common issues and solutions.

## 📝 License

MIT License

## 📞 Support

- Documentation: See ARCHITECTURE.md and QUICKSTART.md
- Issues: Open a GitHub issue

---

**Note**: This is a production-ready microservices architecture with:
- ✅ Security vulnerabilities fixed
- ✅ Containerized services
- ✅ Kubernetes orchestration
- ✅ Auto-scaling capabilities
- ✅ Production-grade monitoring
- ✅ High availability setup


- A `/papers` hub for community-submitted paper explainers.
- A `Submit a paper` flow that can fetch metadata from arXiv.
- Comment threads per paper.
- Light, professional design that can grow into a larger quantum community
  product and monetization platform (collabs, sponsorships, subscriptions).

## 1. Prerequisites

- Node.js 18+ installed
- npm, pnpm, or yarn
- (Optional but recommended) Git + GitHub for version control
- For now, this uses **SQLite** via Prisma for local development. You can later
  switch `provider = "postgresql"` and point `DATABASE_URL` to Supabase, Neon,
  PlanetScale, etc. for production scalability.

## 2. Setup

1. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```

2. Create an `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Run Prisma migrations to create the SQLite database:

   ```bash
   npx prisma migrate dev --name init
   ```

   This will create a `dev.db` file and generate the Prisma client.

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open the site:

   - Go to `http://localhost:3000` for the homepage.
   - Go to `http://localhost:3000/papers` to see the papers hub.
   - Go to `http://localhost:3000/papers/submit` to add a paper explainer.

## 3. Features in this MVP

### Home

- Clean hero section explaining the purpose: quantum papers, learning paths,
  and community.
- Calls to action to browse papers and submit explainers.

### Papers (`/papers`)

- Server-rendered list of all papers from the database.
- Each card shows:
  - Title
  - Abstract (truncated)
  - arXiv ID (if available)
  - Explainer count
  - Comment count

### Submit paper (`/papers/submit`)

- Fetch metadata from arXiv using an ID or URL.
- If fetch fails, you can still enter details manually (title, abstract, URL).
- Form includes fields for:
  - Your name/handle (optional)
  - Summary (required)
  - Intuition (required)
  - Technical notes (optional)
  - Code URL (optional)
- On submit:
  - Validates required fields.
  - Calls `/api/papers` to create a `Paper` and initial `Explanation`.
  - Redirects to the paper detail page.

### Paper detail (`/papers/[id]`)

- Shows full title, abstract, arXiv ID, and original paper URL.
- Lists all explainers (for now, one per paper is created at submission).
- Shows creation dates and optional explainer author.
- Includes a comment thread:
  - Simple client-side component.
  - Calls `/api/papers/[id]/comments` to create new comments.
  - Basic validation and length limits.

### API routes

- `GET /api/health` – health check.
- `POST /api/arxiv/lookup` – fetch arXiv metadata for a given input (ID or URL).
- `GET /api/papers` – list papers (JSON).
- `POST /api/papers` – create a new paper + explainer.
- `POST /api/papers/[id]/comments` – add a comment to a paper.

## 4. Security & Robustness Considerations

- All inputs are trimmed and length-limited on the server.
- React escapes user content by default, preventing basic XSS as long as you
  avoid `dangerouslySetInnerHTML`.
- Comments and explainer texts are stored as plain text for now; you can later
  add markdown support with a proper sanitizer.
- arXiv fetching is done server-side only; the client never talks directly to
  arXiv.
- SQLite is fine for local dev and tiny installs; for real production, point
  Prisma to Postgres (Supabase, Neon, etc.) and re-run migrations.

## 5. Performance & Scalability Path

- The Next.js App Router runs pages as server components where possible.
- `/papers` currently fetches all papers; you can later add pagination.
- The Prisma models are ready to be migrated to Postgres or another SQL DB
  with minimal change (just update `datasource db` in `schema.prisma` and
  `DATABASE_URL` in `.env`, then run `prisma migrate`).
- For high traffic, deploy on Vercel or a similar platform with a managed DB.

## 6. Deploying to Vercel (with SQLite or Postgres)

For a **quick experiment**, you can commit this repo and deploy to Vercel.  
However, note that SQLite on Vercel is effectively read-only in serverless
environments. For a serious deployment:

1. Create a Postgres database (e.g. Supabase, Neon, Railway).
2. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`.
3. Update `DATABASE_URL` in `.env` to point to your Postgres instance.
4. Run:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Commit and push to GitHub, then import into Vercel.
6. In Vercel project settings, add the same `DATABASE_URL` environment variable.
7. Redeploy.

Finally, point your Wix-managed domain (`squants.com`) to Vercel by configuring
DNS (A/CNAME or nameservers) as per Vercel docs.

## 7. Extending from here

Suggested next steps:

- Add user accounts and auth (e.g. NextAuth + OAuth with GitHub/Google).
- Introduce roles and moderation tools.
- Add pagination, filters, and tags for papers (e.g. QC, QML, theory).
- Build out the Learn section with real content and pathways.
- Create collaboration and monetization structures:
  - Partner pages
  - Sponsor banners (lightweight, non-intrusive)
  - Subscription tiers unlocking deeper features

Use GitHub Copilot to help you expand components, create new routes, and wire in
auth, analytics, and payment APIs as your vision grows.
