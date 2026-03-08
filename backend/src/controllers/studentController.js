const prisma = require('../config/database');
const studentService = require('../services/studentService');
const { getParentProfileId } = require('../utils/helpers');
const { studentDTO, gradeDTO, attendanceDTO, timetableDTO } = require('../dtos');

// Parent: get all children
const getMyStudents = async (req, res, next) => {
  try {
    const parentId = await getParentProfileId(req.user.userId);
    const students = await studentService.getStudentsByParent(parentId);

    res.json({
      students: students.map(studentDTO),
    });
  } catch (error) {
    next(error);
  }
};

// Parent: get one child details
const getStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const parentId = await getParentProfileId(req.user.userId);
    const student = await studentService.getStudentDetails(studentId, parentId);

    res.json({
      student: studentDTO(student),
    });
  } catch (error) {
    next(error);
  }
};

// Parent: get child grades
const getGrades = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const parentId = await getParentProfileId(req.user.userId);
    const grades = await studentService.getStudentGrades(studentId, parentId);

    res.json({
      grades: grades.map(gradeDTO),
    });
  } catch (error) {
    next(error);
  }
};

// Parent: get child attendance
const getAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const parentId = await getParentProfileId(req.user.userId);
    const attendance = await studentService.getStudentAttendance(studentId, parentId);

    res.json({
      attendance: attendance.map(attendanceDTO),
    });
  } catch (error) {
    next(error);
  }
};

// Parent: get child timetable
const getTimetable = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const parentId = await getParentProfileId(req.user.userId);
    const timetable = await studentService.getStudentTimetable(studentId, parentId);

    res.json({
      timetable: timetable.map(timetableDTO),
    });
  } catch (error) {
    next(error);
  }
};

// Student: get own profile
const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { firstName: true, lastName: true, email: true },
    });

    const student = await prisma.student.findFirst({
      where: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      include: {
        class: true,
        parent: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json({ ...user, student });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Student: get own grades
const getMyGrades = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    const student = await prisma.student.findFirst({
      where: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

// Student: get own attendance
const getMyAttendance = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    const student = await prisma.student.findFirst({
      where: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendance = await prisma.attendance.findMany({
      where: { studentId: student.id },
      orderBy: { date: 'desc' },
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

// Student: get own timetable
const getMyTimetable = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    const student = await prisma.student.findFirst({
      where: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      include: { class: true },
    });

    if (!student || !student.class) {
      return res.status(404).json({ error: 'Student or class not found' });
    }

    const timetable = await prisma.timetable.findMany({
      where: { classId: student.classId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timetable' });
  }
};

module.exports = {
  getMyStudents,
  getStudent,
  getGrades,
  getAttendance,
  getTimetable,
  getMyProfile,
  getMyGrades,
  getMyAttendance,
  getMyTimetable,
};
