const prisma = require('../config/database');

// Get all students for a parent
const getStudentsByParent = async (parentId) => {
  const students = await prisma.student.findMany({
    where: { parentId },
    include: {
      class: true,
      feeBalance: true,
    },
  });

  return students;
};

// Get student details
const getStudentDetails = async (studentId, parentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      class: true,
      feeBalance: true,
    },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  return student;
};

// Get grades for student
const getStudentGrades = async (studentId, parentId) => {
  // Verify access
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  const grades = await prisma.grade.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
  });

  return grades;
};

// Get attendance for student
const getStudentAttendance = async (studentId, parentId) => {
  // Verify access
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  const attendance = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { date: 'desc' },
  });

  return attendance;
};

// Get timetable for student's class
const getStudentTimetable = async (studentId, parentId) => {
  // Verify access and get student with class
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { class: true },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  if (!student.classId) {
    return [];
  }

  const timetable = await prisma.timetable.findMany({
    where: { classId: student.classId },
    orderBy: { dayOfWeek: 'asc' },
  });

  return timetable;
};

module.exports = {
  getStudentsByParent,
  getStudentDetails,
  getStudentGrades,
  getStudentAttendance,
  getStudentTimetable,
};
