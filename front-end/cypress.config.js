import { defineConfig } from "cypress";
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

export default defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,
  video: true,
  e2e: {
    baseUrl: `http://localhost:${process.env.APP_PORT}`,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    // Environment variables for Cypress
    // APP_PORT: process.env.APP_PORT
  }
});
