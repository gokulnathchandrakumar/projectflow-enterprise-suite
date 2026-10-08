import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const projects = await prisma.project.count();
  const tasks = await prisma.task.count();
  console.log('DB_COUNTS:', { users, projects, tasks });
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
