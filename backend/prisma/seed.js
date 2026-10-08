import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  // Ensure DB is clean for seed
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Alex Morgan demo user
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.create({
    data: {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      passwordHash,
    },
  });

  console.log('✅ Created Demo User:', user.email);

  // Create Projects
  const proj1 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Website Redesign',
      description: 'Corporate website and customer portal modernization with design system standards.',
      status: 'IN_PROGRESS',
      startDate: new Date('2024-09-15'),
      endDate: new Date('2024-10-31'),
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Mobile Banking Rollout',
      description: 'Deployment of biometric authentication and transfer flows for mobile retail apps.',
      status: 'IN_PROGRESS',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-11-15'),
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Q4 Compliance Audit',
      description: 'Annual review of security protocols, SOC-2 readiness, and encryption verification.',
      status: 'NOT_STARTED',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-12-15'),
    },
  });

  const proj4 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Cloud Infrastructure Migration',
      description: 'Migrating legacy monolith services to containerized Kubernetes clusters.',
      status: 'COMPLETED',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-09-30'),
    },
  });

  // Exactly 12 tasks with verified mix:
  // 5 COMPLETED, 4 IN_PROGRESS, 3 PENDING = 12 total (sums to 100%)
  // Some HIGH (urgent) priorities
  const tasksData = [
    // Project 1: Website Redesign (4 tasks: 2 completed, 1 in_progress, 1 pending)
    {
      projectId: proj1.id,
      name: 'Audit legacy information architecture',
      description: 'Catalog all URL redirects and site hierarchy from old portal.',
      priority: 'LOW',
      status: 'COMPLETED',
      dueDate: new Date('2024-10-05'),
    },
    {
      projectId: proj1.id,
      name: 'Customer persona discovery interviews',
      description: 'Synthesize user feedback and map core journeys.',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      dueDate: new Date('2024-10-10'),
    },
    {
      projectId: proj1.id,
      name: 'Finalize homepage wireframes & mobile drawer',
      description: 'High-fidelity prototypes for responsive breakpoints.',
      priority: 'HIGH', // Urgent
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-10-20'),
    },
    {
      projectId: proj1.id,
      name: 'Design system color token harmonization',
      description: 'Dark mode token contrast verification and WCAG audit.',
      priority: 'HIGH', // Urgent
      status: 'PENDING',
      dueDate: new Date('2024-10-25'),
    },

    // Project 2: Mobile Banking Rollout (4 tasks: 1 completed, 2 in_progress, 1 pending)
    {
      projectId: proj2.id,
      name: 'Biometric authentication keychain bridge',
      description: 'FaceID and TouchID bridge integration for React Native.',
      priority: 'HIGH', // Urgent
      status: 'COMPLETED',
      dueDate: new Date('2024-10-12'),
    },
    {
      projectId: proj2.id,
      name: 'Push notification service integration',
      description: 'APNS and FCM integration for instant transaction alerts.',
      priority: 'HIGH', // Urgent
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-10-22'),
    },
    {
      projectId: proj2.id,
      name: 'Transaction history virtualization review',
      description: 'Optimize high-volume ledger scrolling performance.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-10-28'),
    },
    {
      projectId: proj2.id,
      name: 'End-to-end security penetration audit',
      description: 'Run automated vulnerability scan on mobile API endpoints.',
      priority: 'HIGH', // Urgent
      status: 'PENDING',
      dueDate: new Date('2024-11-05'),
    },

    // Project 3: Q4 Compliance Audit (2 tasks: 0 completed, 1 in_progress, 1 pending)
    {
      projectId: proj3.id,
      name: 'SOC2 Type II access log retention verify',
      description: 'Ensure immutable access logs in compliance S3 buckets.',
      priority: 'HIGH', // Urgent
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-11-10'),
    },
    {
      projectId: proj3.id,
      name: 'Prepare vendor security questionnaire',
      description: 'Collect SOC-2 attestations from third-party cloud vendors.',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: new Date('2024-11-20'),
    },

    // Project 4: Cloud Infrastructure Migration (2 tasks: 2 completed)
    {
      projectId: proj4.id,
      name: 'Containerize core API microservices',
      description: 'Docker multi-stage build optimization and vulnerability scanning.',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      dueDate: new Date('2024-08-15'),
    },
    {
      projectId: proj4.id,
      name: 'Kubernetes ingress controller configuration',
      description: 'Zero-downtime deployment pipeline with automated canary routing.',
      priority: 'LOW',
      status: 'COMPLETED',
      dueDate: new Date('2024-09-01'),
    },
  ];

  for (const t of tasksData) {
    await prisma.task.create({ data: t });
  }

  console.log('✅ Seed completed successfully with 1 user, 4 projects, and 12 tasks!');
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('seed.js')) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
