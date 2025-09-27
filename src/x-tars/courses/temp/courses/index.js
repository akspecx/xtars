// Import all course data
import { logicalReasoningCourse } from './LogicalReasoningCourse';
import { physicsCourse } from './PhysicsCourse';
import { MathsCourse } from './MathsCourse'

// Export array of all courses
export const allCourses = [
  logicalReasoningCourse,
  physicsCourse,
  MathsCourse
];

// Export individual courses for direct import if needed
export { logicalReasoningCourse, physicsCourse,MathsCourse};