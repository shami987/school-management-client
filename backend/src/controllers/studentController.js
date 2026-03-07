const studentService = require('../services/studentService');
const { studentDTO, gradeDTO, attendanceDTO, timetableDTO } = require('../dtos');
const { getParentProfileId } = require('../utils/helpers');

// Get all students for logged-in parent
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

// Get student details
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

// Get student grades
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

// Get student attendance
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

// Get student timetable
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

module.exports = {
  getMyStudents,
  getStudent,
  getGrades,
  getAttendance,
  getTimetable,
};
