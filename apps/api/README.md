# 🚀 Monorepo API Deployment Guide (Vercel + Node.js + TypeScript)

This guide documents how to successfully deploy a **monorepo API** and avoid common production errors.

---

## 📦 Project Structure

```
apps/
  api/          # Express API
  web/          # Next.js frontend

packages/
  schemas/      # Shared Zod schemas
  types/        # Shared types
  typescript-config/ # Shared tsconfig
```

---

## ⚙️ Build Strategy

### ✅ Use this setup

* **Dev** → `tsx`
* **Build** → `tsup`
* **Prod** → `node dist/server.js`

---

## 🧾 API Package Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup",
    "start": "node dist/server.js"
  }
}
```

---

## 🏗️ Vercel Configuration

### ✅ Build Command

```bash
cd ../.. && turbo build --filter=@calorie-track/api
```

👉 This ensures:

* Vercel runs from monorepo root
* Builds only the API + its dependencies

---

### ✅ Output

Make sure your API builds to:

```
dist/server.js
```

---

### ✅ Start Command

```bash
node dist/server.js
```

---

## 📦 tsup Config

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  bundle: true,
  sourcemap: true,
  clean: true,
});
```

---

## ⚠️ MUST-FIX Before Deployment

---

### ❌ 1. Path Alias Error

```
Error: Cannot find package '@/routes'
```

#### 🔥 Cause:

Node.js does NOT understand TypeScript path aliases.

#### ✅ Fix:

```ts
// ❌ Wrong
import routes from "@/routes";

// ✅ Correct
import routes from "./routes.js";
```

---

### ❌ 2. ESM Import Extension Error

```
Error: Cannot find module '/middleware/not-found'
```

#### 🔥 Cause:

ESM requires file extensions.

#### ✅ Fix:

```ts
// ❌ Wrong
import notFound from "./middleware/not-found";

// ✅ Correct
import notFound from "./middleware/not-found.js";
```

---

### ❌ 3. DevDependencies Missing in Production

```
TS6053: File '@calorie-track/typescript-config/base.json' not found
```

#### 🔥 Cause:

Vercel skips `devDependencies`.

#### ✅ Fix:

Move shared config to `dependencies`:

```json
"dependencies": {
  "@calorie-track/typescript-config": "workspace:*"
}
```

---


### ❌ 4. Express Multer Type Error

```
Namespace 'Express' has no exported member 'Multer'
```

#### 🔥 Cause:

TypeScript not loading multer types.

#### ✅ Fix:

```bash
pnpm add -D @types/multer
```

OR update `tsconfig`:

```json
"types": ["node", "express", "multer"]
```

---

### ❌ 5. Function Invocation Failed (Vercel)

```
FUNCTION_INVOCATION_FAILED
```

#### 🔥 Cause:

App crashed at runtime (usually build issues).

#### ✅ Checklist:

* Build output exists (`dist/`)
* Correct start file
* No alias issues
* All env variables set

---

### ❌ 6. tsconfig Extends Not Found

```
TS6053: File '@calorie-track/typescript-config/base.json' not found
```

#### 🔥 Fix:

Ensure in shared config must export:

```json
"exports": {
  "./base.json": "./base.json"
}
```

---

## 🚀 Deployment Checklist

Before deploying, verify:

* [ ] All imports use `.js` extensions
* [ ] No `@/` aliases in backend
* [ ] Build output exists (`dist/server.js`)
* [ ] Vercel runs `dist` (not `src`)
* [ ] Shared packages are in `dependencies`
* [ ] Env variables are set in Vercel
* [ ] `pnpm -r build` works locally

---

## 🧠 Key Lessons

### 1. TypeScript ≠ Runtime

Aliases and types only exist during development.

---

### 2. ESM is Strict

Always include file extensions.

---

### 3. Monorepo Requires Proper Dependency Management

Anything needed at build time must be in `dependencies`.

---

### 4. Dev ≠ Production

Tools like `tsx` work locally but not in production.

---

## 💡 Recommended Workflow

```bash
# Development
pnpm dev

# Build all packages
pnpm -r build

# Run production build
node dist/server.js
```

---

## 🔥 Final Tip

If something works locally but fails in production:

👉 Check:

* imports
* build output
* environment variables

---

Happy shipping 🚀
