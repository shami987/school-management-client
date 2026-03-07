const { PrismaClient } = require('@prisma/client');

// Prisma client singleton to prevent multiple instances
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;
