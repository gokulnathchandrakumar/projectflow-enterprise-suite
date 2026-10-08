import app from './app.js';
import prisma from './config/db.js';
import { seedDatabase } from '../prisma/seed.js';

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

      // Automatically seed if the database is brand new (0 users)
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        console.log('  [Database] Empty database detected. Auto-seeding initial dataset...');
        await seedDatabase();
        console.log('  [Database] Initial dataset successfully seeded!');
      }
    }
  } catch (err) {
    console.warn('  [Database Notice] Could not connect to database on startup:', err.message);
    console.warn('  Configure DATABASE_URL to connect to your database instance.');
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
