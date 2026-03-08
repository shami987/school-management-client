const prisma = require('../config/database');

// Get teacher's assigned classes
const getMyClasses = async (req, res) => {
  try {
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user.userId },
      include: {
        classes: {
          include: {
            students: true,
            _count: {
              select: { students: true }
            }
          }
        }
      }
    });

    if (!teacherProfile) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    res.json(teacherProfile.classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Get students in a specific class
const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Verify teacher owns this class
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user.userId },
      include: { classes: { where: { id: classId } } }
    });

    if (!teacherProfile || teacherProfile.classes.length === 0) {
      return res.status(403).json({ error: 'Access denied to this class' });
    }

    const students = await prisma.student.findMany({
      where: { classId },
      include: {
        parent: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// Add/Update grades for students
const addGrade = async (req, res) => {
  try {
    const { studentId, subject, score, maxScore, term, academicYear, remarks } = req.body;
    
    // Verify teacher can access this student
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user.userId },
      include: { classes: { where: { id: student.classId } } }
    });

    if (!teacherProfile || teacherProfile.classes.length === 0) {
      return res.status(403).json({ error: 'Access denied to this student' });
    }

    const grade = await prisma.grade.create({
      data: {
        studentId,
        subject,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        term,
        academicYear,
        remarks
      }
    });

    res.status(201).json(grade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add grade' });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body; // Array of {studentId, date, status, remarks}
    
    // Verify teacher can access these students
    const studentIds = attendanceData.map(a => a.studentId);
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      include: { class: true }
    });

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user.userId },
      include: { classes: true }
    });

    const teacherClassIds = teacherProfile.classes.map(c => c.id);
    const unauthorizedStudents = students.filter(s => !teacherClassIds.includes(s.classId));

    if (unauthorizedStudents.length > 0) {
      return res.status(403).json({ error: 'Access denied to some students' });
    }

    const attendance = await prisma.attendance.createMany({
      data: attendanceData.map(a => ({
        studentId: a.studentId,
        date: new Date(a.date),
        status: a.status,
        remarks: a.remarks
      })),
      skipDuplicates: true
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

module.exports = {
  getMyClasses,
  getClassStudents,
  addGrade,
  markAttendance
};