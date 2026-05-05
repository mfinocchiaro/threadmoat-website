# Database Migrations

## Overview

Database migrations for ThreadMoat using Neon (serverless Postgres).

## Running Migrations

### Option 1: Using Neon SQL Editor (Recommended for Production)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project and branch
3. Open **SQL Editor**
4. Copy the migration file content and paste into the editor
5. Click **Execute**

### Option 2: Using psql (Local/Dev)

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:password@host/database"

# Run migration
psql $DATABASE_URL < db/migrations/202605051400_gsc_schema.sql

# Verify tables were created
psql $DATABASE_URL -c "\dt gsc_*"
```

### Option 3: Using Node Script (Programmatic)

```bash
node scripts/run-migration.js db/migrations/202605051400_gsc_schema.sql
```

## Migration Structure

Each migration file:
- Named with timestamp: `YYYYMMDDHHMM_description.sql`
- Contains `CREATE TABLE IF NOT EXISTS` (idempotent)
- Includes indexes and constraints
- Has comments for documentation

## Existing Migrations

| File | Purpose | Status |
|------|---------|--------|
| `202605051400_gsc_schema.sql` | GSC data schema (M027 Phase 2) | Ready |

## Rollback

For `CREATE TABLE IF NOT EXISTS`, no rollback needed (safe to re-run).

For destructive migrations, add rollback comments:
```sql
-- ROLLBACK: DROP TABLE IF EXISTS table_name;
```

## Verification

After running a migration:

```sql
-- List all tables
\dt

-- Check specific table schema
\d gsc_properties

-- Check indexes
\di gsc_*

-- Check constraints
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name LIKE 'gsc_%';
```
