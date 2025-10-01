import { defineConfig } from 'adonis-open-swagger'

/**
 * Configuration for Open Swagger
 */
export default defineConfig({
  /**
   * Enable or disable swagger documentation
   */
  enabled: true,

  /**
   * Path where the documentation will be served
   */
  path: '/api/docs',

  /**
   * Schema validator to use for automatic schema conversion
   * Choose based on your preferred validation library
   */
  validator: 'vinejs', // 'vinejs' | 'zod' | 'typebox'

  /**
   * OpenAPI specification information
   */
  info: {
    title: 'Lets go admin',
    version: '0.0.0',
    description: 'API documentation for Lets-go admin',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  /**
   * Servers configuration
   */
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Development server',
    },
  ],

  /**
   * Scalar UI configuration
   */
  scalar: {
    /**
     * Theme: 'auto' for system preference, or choose from Scalar themes:
     * 'default', 'moon', 'purple', 'solarized', 'bluePlanet', 'saturn',
     * 'kepler', 'mars', 'deepSpace', 'laserwave', 'elysiajs', 'none'
     */
    theme: 'elysiajs',

    /**
     * Layout: 'modern' or 'classic'
     */
    layout: 'modern',

    /**
     * Show sidebar
     */
    showSidebar: true,

    /**
     * Custom CSS for additional styling
     */
    customCss: '',

    /**
     * Additional Scalar configuration
     */
    configuration: {
      // Add any additional Scalar options here
    },
  },

  /**
   * Route scanning options
   */
  routes: {
    /**
     * Automatically scan for routes
     */
    autoScan: true,

    /**
     * Include routes matching these patterns
     */
    include: [
      '/api/*',
      // Add more patterns as needed
    ],

    /**
     * Exclude routes matching these patterns
     */
    exclude: [
      '/api/docs*',
      '/api/health*',
      // Add more patterns as needed
    ],
  },

  /**
   * Tags for grouping endpoints
   */
  tags: [
    {
      name: 'Auth',
      description: 'Auth related endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    // Add more tags as needed
  ],

  /**
   * Custom OpenAPI specification to merge with auto-generated spec
   * This allows you to add custom documentation that can't be auto-generated
   */
  customSpec: {
    // Add custom OpenAPI specification here
    // This will be merged with the auto-generated specification
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'OAT',
          description:
            "Enter OAT Bearer token **_without_** the 'Bearer ' prefix that starts with 'oat_'.",
        },
      },
      schemas: {},
    },
  },
  components: {
    /**
     * Array of file paths or directory paths to include schemas
     * Supports import aliases, patterns, files, and directories
     */
    include: ['#dtos/*'],
  },
})
