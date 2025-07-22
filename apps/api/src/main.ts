import express from 'express';
import * as path from 'path';
import { expressOpenApi } from './service/express-openapi';
import cors from 'cors';
import { sequelize } from './service/sequelize';

// Helper function to log all registered routes for debugging
const logRegisteredRoutes = (app: express.Express) => {
  console.log('\n=== REGISTERED ROUTES ===');
  app._router.stack.forEach((middleware: any, index: number) => {
    if (middleware.route) {
      // Direct routes
      console.log(
        `${index}: ${Object.keys(middleware.route.methods)
          .join(', ')
          .toUpperCase()} ${middleware.route.path}`
      );
    } else if (middleware.name === 'router') {
      // Router middleware (where express-openapi routes would be)
      console.log(`${index}: Router middleware`);
      if (middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach(
          (handler: any, handlerIndex: number) => {
            if (handler.route) {
              console.log(
                `  ${index}.${handlerIndex}: ${Object.keys(
                  handler.route.methods
                )
                  .join(', ')
                  .toUpperCase()} ${handler.route.path}`
              );
            }
          }
        );
      }
    } else {
      console.log(`${index}: ${middleware.name || 'anonymous'} middleware`);
    }
  });
  console.log('========================\n');
};

// Bootstrap function to handle async initialization properly
const bootstrap = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/assets', express.static(path.join(__dirname, 'assets')));

  // Health check endpoint for basic server status
  app.get('/', (req, res) => {
    res.send({ message: 'Welcome to Connex Tech Test API' });
  });

  console.log('_______ 1');
  // Initialize OpenAPI routes and wait for completion before starting server
  await expressOpenApi(app);
  console.log('_______ 2');

  const port = process.env.PORT || 3333;

  // Start server and establish database connection
  const server = app.listen(port, async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    // Debug: Log all registered routes after server starts
    logRegisteredRoutes(app);

    console.log(`Listening at http://localhost:${port}`);
  });

  server.on('error', console.error);
};

// Start the application with proper error handling
bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1); // Fixed the typo here
});
