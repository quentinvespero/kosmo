import 'dotenv/config'
import { defineConfig, env } from "prisma/config"

export default defineConfig({
    schema: './prisma/schema.prisma',
    migrations: {
        path: './prisma/migrations'
    },
    datasource: {
        // Use the unpooled (direct) connection for CLI operations like migrations
        // PgBouncer transaction mode doesn't support session-level features Prisma Migrate needs
        url: env('DATABASE_URL_UNPOOLED'),
    },
})