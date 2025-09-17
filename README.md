This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/shubhamjangid-dev/Buyer-Lead-Intake-app.git
cd Buyer-Lead-Intake-app
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Setup environment variables

```bash
# Database URL for Prisma
DATABASE_URL="postgresql://postgres:secret123@localhost:5432/postgres"

# NextAuth / App secrets
NEXTAUTH_SECRET="your-secret-key"
```

### 4. Running Docker PostgreSQL container

```bash
docker run --rm --name postgres-DB -p 5432:5432 -e POSTGRES_PASSWORD=secret123 postgres
```

### 5. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
```

### 6. Run the App

```bash
pnpm dev
# or
npm run dev
```
