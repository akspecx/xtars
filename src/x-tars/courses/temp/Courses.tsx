import React from 'react';
import CourseCard from './courses/CourseCard.tsx';
import { allCourses } from './courses/index.js';

const Courses = () => {
  return (
    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div className="w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none relative shadow-inner min-h-screen">
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
  
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Course Library</h1>
        
        <div className="space-y-16">
          {allCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;