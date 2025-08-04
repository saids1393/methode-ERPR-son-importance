const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProfessorIdQuery() {
  try {
    // Test the query that's causing the issue
    const testQuery = await prisma.user.findMany({
      where: {
        professorId: "test-id",
        gender: "HOMME",
        isActive: true
      },
      select: {
        id: true,
        email: true,
        professorId: true
      }
    });
    
    console.log('Query successful:', testQuery);
  } catch (error) {
    console.error('Query failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testProfessorIdQuery();