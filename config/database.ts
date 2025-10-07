import { defineConfig } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'

import env from '#start/env'

const dbConfig = defineConfig({
  connection: 'postgres',
  prettyPrintDebugQueries: app.inDev,
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
