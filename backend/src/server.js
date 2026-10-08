import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`  ProjectFlow Unified REST API Server Running  `);
  console.log(`  Port: http://localhost:${PORT}             `);
  console.log(`  Health Check: http://localhost:${PORT}/api/health `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`===============================================`);

  try {
    if (prisma) {
      await prisma.$connect();
      console.log('  [Database] Connected successfully via Prisma');
    }
  } catch (err) {
    console.warn('  [Database Notice] Could not connect to database on startup:', err.message);
    console.warn('  Configure DATABASE_URL in backend/.env to connect to your MySQL instance.');
  }
});

const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
    console.log('HTTP server closed and database disconnected.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
