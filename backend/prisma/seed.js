const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Hash password using SHA-512 then bcrypt
const hashPassword = async (password) => {
  const sha512Hash = crypto.createHash('sha512').update(password).digest('hex');
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(sha512Hash, salt);
};

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create verified device for admin
  await prisma.device.upsert({
    where: {
      userId_deviceId: {
        userId: admin.id,
        deviceId: 'admin-test-device'
      }
    },
    update: {
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
    create: {
      userId: admin.id,
      deviceId: 'admin-test-device',
      deviceName: 'Postman Testing',
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
  });
  console.log('Admin device created and verified');

  // Create a sample parent
  const parentPassword = await hashPassword('Parent@123');
  const parent = await prisma.user.upsert({
    where: { email: 'parent@test.com' },
    update: {},
    create: {
      email: 'parent@test.com',
      password: parentPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'PARENT',
      parentProfile: {
        create: {
          phone: '+250788123456',
          address: 'Kigali, Rwanda',
        },
      },
    },
  });
  console.log('Sample parent created:', parent.email);

  // Create verified device for parent
  await prisma.device.upsert({
    where: {
      userId_deviceId: {
        userId: parent.id,
        deviceId: 'parent-test-device'
      }
    },
    update: {
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
    create: {
      userId: parent.id,
      deviceId: 'parent-test-device',
      deviceName: 'Postman Testing',
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
  });
  console.log('Parent device created and verified');

  // Get parent profile
  const parentProfile = await prisma.parentProfile.findUnique({
    where: { userId: parent.id },
  });

  // Create sample teacher
  const teacherPassword = await hashPassword('Teacher@123');
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      password: teacherPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'TEACHER',
      teacherProfile: {
        create: {
          phone: '+250788654321',
          subject: 'Mathematics',
        },
      },
    },
  });
  console.log('Sample teacher created:', teacher.email);

  // Create verified device for teacher
  await prisma.device.upsert({
    where: {
      userId_deviceId: {
        userId: teacher.id,
        deviceId: 'teacher-test-device'
      }
    },
    update: {
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
    create: {
      userId: teacher.id,
      deviceId: 'teacher-test-device',
      deviceName: 'Postman Testing',
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
  });
  console.log('Teacher device created and verified');

  // Get teacher profile
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: teacher.id },
  });

  // Create sample class
  const class1 = await prisma.class.upsert({
    where: { name: 'Grade 5A' },
    update: {},
    create: {
      name: 'Grade 5A',
      grade: '5',
      section: 'A',
      teacherId: teacherProfile.id,
      academicYear: '2024',
    },
  });
  console.log('Sample class created:', class1.name);

  // Create sample students
  const student1 = await prisma.student.create({
    data: {
      firstName: 'Alice',
      lastName: 'Doe',
      dateOfBirth: new Date('2014-05-15'),
      parentId: parentProfile.id,
      classId: class1.id,
      feeBalance: {
        create: {
          balance: 50000,
        },
      },
    },
  });
  console.log('Sample student created:', student1.firstName, student1.lastName);

  // Create sample grades
  await prisma.grade.createMany({
    data: [
      {
        studentId: student1.id,
        subject: 'Mathematics',
        score: 85,
        maxScore: 100,
        term: 'Term 1',
        academicYear: '2024',
        remarks: 'Excellent performance',
      },
      {
        studentId: student1.id,
        subject: 'English',
        score: 78,
        maxScore: 100,
        term: 'Term 1',
        academicYear: '2024',
        remarks: 'Good progress',
      },
    ],
  });
  console.log('Sample grades created');

  // Create sample attendance
  await prisma.attendance.createMany({
    data: [
      {
        studentId: student1.id,
        date: new Date('2024-01-15'),
        status: 'PRESENT',
      },
      {
        studentId: student1.id,
        date: new Date('2024-01-16'),
        status: 'PRESENT',
      },
      {
        studentId: student1.id,
        date: new Date('2024-01-17'),
        status: 'ABSENT',
        remarks: 'Sick',
      },
    ],
  });
  console.log('Sample attendance created');

  // Create sample timetable
  await prisma.timetable.createMany({
    data: [
      {
        classId: class1.id,
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
        subject: 'Mathematics',
        teacher: 'Mr. Smith',
        room: 'Room 101',
      },
      {
        classId: class1.id,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        subject: 'English',
        teacher: 'Mrs. Johnson',
        room: 'Room 102',
      },
    ],
  });
  console.log('Sample timetable created');

  // Create sample student user
  const studentPassword = await hashPassword('Student@123');
  const studentUser = await prisma.user.upsert({
    where: { email: 'alice.doe@student.com' },
    update: {},
    create: {
      email: 'alice.doe@student.com',
      password: studentPassword,
      firstName: 'Alice',
      lastName: 'Doe',
      role: 'STUDENT',
    },
  });
  console.log('Sample student user created:', studentUser.email);

  // Create verified device for student
  await prisma.device.upsert({
    where: {
      userId_deviceId: {
        userId: studentUser.id,
        deviceId: 'student-test-device'
      }
    },
    update: {
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
    create: {
      userId: studentUser.id,
      deviceId: 'student-test-device',
      deviceName: 'Postman Testing',
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
  });
  console.log('Student device created and verified');

  console.log('Database seed completed successfully!');
  console.log('\nTest Credentials:');
  console.log('Admin: admin@school.com / Admin@123 / deviceId: admin-test-device');
  console.log('Parent: parent@test.com / Parent@123 / deviceId: parent-test-device');
  console.log('Teacher: teacher@school.com / Teacher@123 / deviceId: teacher-test-device');
  console.log('Student: alice.doe@student.com / Student@123 / deviceId: student-test-device');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
