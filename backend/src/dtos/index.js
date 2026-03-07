// User DTO - exclude sensitive fields
const userDTO = (user) => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
};

// Student DTO
const studentDTO = (student) => {
  return {
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth,
    enrollmentDate: student.enrollmentDate,
    class: student.class ? {
      id: student.class.id,
      name: student.class.name,
      grade: student.class.grade,
      section: student.class.section,
    } : null,
  };
};

// Fee balance DTO
const feeBalanceDTO = (feeBalance) => {
  return {
    studentId: feeBalance.studentId,
    balance: parseFloat(feeBalance.balance),
    updatedAt: feeBalance.updatedAt,
  };
};

// Transaction DTO
const transactionDTO = (transaction) => {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: parseFloat(transaction.amount),
    description: transaction.description,
    createdAt: transaction.createdAt,
  };
};

// Grade DTO
const gradeDTO = (grade) => {
  return {
    id: grade.id,
    subject: grade.subject,
    score: parseFloat(grade.score),
    maxScore: parseFloat(grade.maxScore),
    percentage: (parseFloat(grade.score) / parseFloat(grade.maxScore) * 100).toFixed(2),
    term: grade.term,
    academicYear: grade.academicYear,
    remarks: grade.remarks,
  };
};

// Attendance DTO
const attendanceDTO = (attendance) => {
  return {
    id: attendance.id,
    date: attendance.date,
    status: attendance.status,
    remarks: attendance.remarks,
  };
};

// Timetable DTO
const timetableDTO = (timetable) => {
  return {
    id: timetable.id,
    dayOfWeek: timetable.dayOfWeek,
    startTime: timetable.startTime,
    endTime: timetable.endTime,
    subject: timetable.subject,
    teacher: timetable.teacher,
    room: timetable.room,
  };
};

// Refund request DTO
const refundRequestDTO = (refund) => {
  return {
    id: refund.id,
    amount: parseFloat(refund.amount),
    reason: refund.reason,
    status: refund.status,
    requestedAt: refund.requestedAt,
    processedAt: refund.processedAt,
    adminNotes: refund.adminNotes,
  };
};

module.exports = {
  userDTO,
  studentDTO,
  feeBalanceDTO,
  transactionDTO,
  gradeDTO,
  attendanceDTO,
  timetableDTO,
  refundRequestDTO,
};
